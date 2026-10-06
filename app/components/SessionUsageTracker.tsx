'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useClientSession } from './ClientSession';
import styles from './SessionUsageTracker.module.css';
import UsageReport, { type StudyPreferences } from './UsageReport';
import { dayKey, formatDuration, trackStudy, type UsageRecord } from './usageStats';

type NumericMap = Record<string, number>;


const OWNER_KEY = 'tons-de-mandarim:usage-owner';
const RECORD_PREFIX = 'tons-de-mandarim:usage-session:';
const PREFS_KEY = 'tons-de-mandarim:study-preferences';
const GOAL_VERSION_KEY = 'tons-de-mandarim:study-goal-v2';
const PAUSE_KEY = 'tons-de-mandarim:study-paused';
const REPORT_ENDPOINT = '/api/usage';
let memoryOwnerId = '';

function newId() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function ownerId() {
  if (memoryOwnerId) return memoryOwnerId;
  try {
    const stored = window.localStorage.getItem(OWNER_KEY);
    if (stored) return (memoryOwnerId = stored);
    memoryOwnerId = newId();
    window.localStorage.setItem(OWNER_KEY, memoryOwnerId);
    return memoryOwnerId;
  } catch {
    return (memoryOwnerId = newId());
  }
}

function addAcrossDays(target: NumericMap, startedAt: number, endedAt: number) {
  let cursor = startedAt;
  while (cursor < endedAt) {
    const date = new Date(cursor);
    const nextMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).getTime();
    const segmentEnd = Math.min(endedAt, nextMidnight);
    const key = dayKey(cursor);
    target[key] = (target[key] ?? 0) + Math.max(0, segmentEnd - cursor);
    cursor = segmentEnd;
  }
}

function validRecord(value: unknown): value is UsageRecord {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const record = value as Partial<UsageRecord>;
  return typeof record.ownerId === 'string' && typeof record.sessionId === 'string'
    && typeof record.startedAt === 'number' && typeof record.lastSeenAt === 'number'
    && typeof record.openMs === 'number' && typeof record.visibleMs === 'number'
    && Boolean(record.dailyMs) && Boolean(record.dailyVisibleMs) && Boolean(record.pages);
}

function readRecord(sessionId: string) {
  try {
    const raw = window.localStorage.getItem(`${RECORD_PREFIX}${sessionId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return validRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeRecord(record: UsageRecord) {
  try { window.localStorage.setItem(`${RECORD_PREFIX}${record.sessionId}`, JSON.stringify(record)); } catch { /* Live tracking still works in memory. */ }
}

function localRecords(currentOwnerId: string) {
  const records: UsageRecord[] = [];
  try {
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (!key?.startsWith(RECORD_PREFIX)) continue;
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as unknown;
      if (validRecord(parsed) && parsed.ownerId === currentOwnerId) records.push(parsed);
    }
  } catch { /* Reports can still use the active in-memory record. */ }
  return records;
}

function mergeRecords(remote: UsageRecord[], local: UsageRecord[]) {
  const merged = new Map<string, UsageRecord>();
  [...remote, ...local].forEach((record) => {
    const current = merged.get(record.sessionId);
    if (!current || record.lastSeenAt >= current.lastSeenAt) merged.set(record.sessionId, { ...record, studyDays: record.studyDays ?? current?.studyDays });
    else if (!current.studyDays && record.studyDays) merged.set(record.sessionId, { ...current, studyDays: record.studyDays });
  });
  return [...merged.values()].sort((a, b) => b.startedAt - a.startedAt);
}

export default function SessionUsageTracker() {
  const { sessionId } = useClientSession();
  const pathname = usePathname();
  const [reportOpen, setReportOpen] = useState(false);
  const [preferences, setPreferences] = useState<StudyPreferences>({ goal: 360, tenths: true });
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const [liveActiveMs, setLiveActiveMs] = useState(0);
  const [currentDay, setCurrentDay] = useState('');
  const [records, setRecords] = useState<UsageRecord[]>([]);
  const recordRef = useRef<UsageRecord | null>(null);
  const ownerRef = useRef('');
  const openAnchorRef = useRef(0);
  const visibleAnchorRef = useRef<number | null>(null);
  const pageRef = useRef(pathname);
  const checkpointRef = useRef<(ended?: boolean, remote?: boolean) => UsageRecord | null>(() => null);

  useEffect(() => {
    if (!sessionId) return;
    try {
      const settings = JSON.parse(localStorage.getItem(PREFS_KEY) ?? 'null');
      const migrated = localStorage.getItem(GOAL_VERSION_KEY) === 'true';
      const next = { goal: migrated && settings && Number.isInteger(settings.goal) && settings.goal >= 1 && settings.goal <= 1440 ? settings.goal : 360, tenths: settings ? Boolean(settings.tenths) : true };
      queueMicrotask(() => setPreferences(next));
      localStorage.setItem(PREFS_KEY, JSON.stringify(next));
      localStorage.setItem(GOAL_VERSION_KEY, 'true');
      pausedRef.current = sessionStorage.getItem(PAUSE_KEY) === 'true';
      const isPaused = pausedRef.current;
      queueMicrotask(() => setPaused(isPaused));
    } catch { /* Defaults when storage is unavailable. */ }
    const now = Date.now();
    const currentOwnerId = ownerId();
    ownerRef.current = currentOwnerId;
    const stored = readRecord(sessionId);
    const record: UsageRecord = stored && stored.ownerId === currentOwnerId ? stored : {
      ownerId: currentOwnerId,
      sessionId,
      startedAt: now,
      lastSeenAt: now,
      endedAt: null,
      openMs: 0,
      visibleMs: 0,
      dailyMs: {},
      dailyVisibleMs: {},
      pages: {},
    };

    record.endedAt = null;
    record.studyDays ??= {};
    recordRef.current = record;
    openAnchorRef.current = now;
    visibleAnchorRef.current = !pausedRef.current ? now : null;
    pageRef.current = window.location.pathname;
    writeRecord(record);

    const sendRemote = (payload: UsageRecord, unload = false) => {
      const body = JSON.stringify(payload);
      if (unload && 'sendBeacon' in navigator) {
        navigator.sendBeacon(REPORT_ENDPOINT, new Blob([body], { type: 'application/json' }));
        return;
      }
      void fetch(REPORT_ENDPOINT, {
        method: 'POST',
        cache: 'no-store',
        credentials: 'same-origin',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
        body,
      }).catch(() => undefined);
    };

    const checkpoint = (ended = false, remote = false) => {
      const active = recordRef.current;
      if (!active || active.sessionId !== sessionId) return null;
      const timestamp = Date.now();

      addAcrossDays(active.dailyMs, openAnchorRef.current, timestamp);
      active.openMs += Math.max(0, timestamp - openAnchorRef.current);
      openAnchorRef.current = timestamp;

      if (visibleAnchorRef.current !== null) {
        const activeDuration = Math.max(0, timestamp - visibleAnchorRef.current);
        addAcrossDays(active.dailyVisibleMs, visibleAnchorRef.current, timestamp);
        trackStudy(active, pageRef.current, visibleAnchorRef.current, timestamp);
        active.visibleMs += activeDuration;
        active.pages[pageRef.current] = (active.pages[pageRef.current] ?? 0) + activeDuration;
        visibleAnchorRef.current = timestamp;
      }

      active.lastSeenAt = timestamp;
      active.endedAt = ended ? timestamp : null;
      writeRecord(active);
      setLiveActiveMs(active.visibleMs);
      if (remote) sendRemote(active, ended);
      return active;
    };
    checkpointRef.current = checkpoint;

    let checkpointCount = 0;
    const displayTimer = window.setInterval(() => {
      const active = recordRef.current;
      if (active?.sessionId === sessionId) {
        const timestamp = Date.now();
        const currentActiveDuration = visibleAnchorRef.current === null
          ? 0
          : Math.max(0, timestamp - visibleAnchorRef.current);
        setLiveActiveMs(active.visibleMs + currentActiveDuration);
        const today = dayKey(timestamp);
        setCurrentDay((current) => current === today ? current : today);
      }
    }, 100);
    const storageTimer = window.setInterval(() => {
      checkpointCount += 1;
      checkpoint(false, checkpointCount % 5 === 0);
    }, 1000);

    const onActivityChange = () => {
      checkpoint(false, true);
    };
    const onPageHide = () => {
      checkpoint(true, true);
      visibleAnchorRef.current = null;
    };
    const onPageShow = () => {
      openAnchorRef.current = Date.now();
      visibleAnchorRef.current = !pausedRef.current ? Date.now() : null;
    };
    document.addEventListener('visibilitychange', onActivityChange);
    window.addEventListener('focus', onActivityChange);
    window.addEventListener('blur', onActivityChange);
    window.addEventListener('pagehide', onPageHide);
    window.addEventListener('beforeunload', onPageHide);
    window.addEventListener('pageshow', onPageShow);

    return () => {
      window.clearInterval(displayTimer);
      window.clearInterval(storageTimer);
      document.removeEventListener('visibilitychange', onActivityChange);
      window.removeEventListener('focus', onActivityChange);
      window.removeEventListener('blur', onActivityChange);
      window.removeEventListener('pagehide', onPageHide);
      window.removeEventListener('beforeunload', onPageHide);
      window.removeEventListener('pageshow', onPageShow);
      checkpoint(true, true);
      if (recordRef.current?.sessionId === sessionId) recordRef.current = null;
    };
  }, [sessionId]);

  useEffect(() => {
    if (!recordRef.current || pageRef.current === pathname) return;
    checkpointRef.current(false, true);
    pageRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if (!reportOpen) return;
    let cancelled = false;

    const refresh = async () => {
      checkpointRef.current(false, true);
      const currentOwnerId = ownerRef.current;
      const local = localRecords(currentOwnerId);
      if (!cancelled) setRecords(local.sort((a, b) => b.startedAt - a.startedAt));
      try {
        const response = await fetch(`${REPORT_ENDPOINT}?owner=${encodeURIComponent(currentOwnerId)}`, {
          cache: 'no-store',
          credentials: 'same-origin',
        });
        if (!response.ok) return;
        const data = await response.json() as { records?: UsageRecord[] };
        const remote = (data.records ?? []).filter(validRecord).filter((item) => item.ownerId === currentOwnerId);
        if (!cancelled) setRecords(mergeRecords(remote, localRecords(currentOwnerId)));
      } catch { /* The precise local report remains available offline. */ }
    };

    void refresh();
    const refreshTimer = window.setInterval(() => void refresh(), 5000);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setReportOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      cancelled = true;
      window.clearInterval(refreshTimer);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [reportOpen]);

  const openReport = () => {
    checkpointRef.current(false, true);
    setCurrentDay(dayKey(Date.now()));
    setRecords(localRecords(ownerRef.current).sort((a, b) => b.startedAt - a.startedAt));
    setReportOpen(true);
  };

  return (
    <>
      <button className={styles.timerButton} type="button" onClick={openReport}
        aria-haspopup="dialog" aria-expanded={reportOpen}>
        <span>Tempo de estudo</span>
        <strong>{formatDuration(liveActiveMs, preferences.tenths)}</strong>
      </button>

      {reportOpen && <UsageReport records={records} today={currentDay} liveMs={liveActiveMs} paused={paused}
        preferences={preferences} onClose={() => setReportOpen(false)}
        onPreferences={(next) => { setPreferences(next); try { localStorage.setItem(PREFS_KEY, JSON.stringify(next)); } catch { /* In-memory settings remain usable. */ } }}
        onPause={() => {
          checkpointRef.current(false, true);
          setRecords(localRecords(ownerRef.current).sort((a, b) => b.startedAt - a.startedAt));
          pausedRef.current = !pausedRef.current;
          setPaused(pausedRef.current);
          visibleAnchorRef.current = !pausedRef.current ? Date.now() : null;
          try { sessionStorage.setItem(PAUSE_KEY, String(pausedRef.current)); } catch { /* In-memory pause remains usable. */ }
        }} />}

    </>
  );
}
