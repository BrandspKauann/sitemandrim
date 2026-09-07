'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useClientSession } from './ClientSession';
import styles from './SessionUsageTracker.module.css';

type NumericMap = Record<string, number>;

type UsageRecord = {
  ownerId: string;
  sessionId: string;
  startedAt: number;
  lastSeenAt: number;
  endedAt: number | null;
  openMs: number;
  visibleMs: number;
  dailyMs: NumericMap;
  dailyVisibleMs: NumericMap;
  pages: NumericMap;
};

const OWNER_KEY = 'tons-de-mandarim:usage-owner';
const RECORD_PREFIX = 'tons-de-mandarim:usage-session:';
const REPORT_ENDPOINT = '/api/usage';
const PAGE_LABELS: Record<string, string> = {
  '/': 'Frases',
  '/letras-e-silabas': 'Letras e sílabas',
  '/exercicios': 'Exercícios',
  '/tons': 'Tons',
  '/hsk1': 'HSK1',
};
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

function dayKey(timestamp: number) {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
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

function formatDuration(milliseconds: number, tenths = false) {
  const safe = Math.max(0, milliseconds);
  const totalSeconds = Math.floor(safe / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const base = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  return tenths ? `${base}.${Math.floor((safe % 1000) / 100)}` : base;
}

function mergeRecords(remote: UsageRecord[], local: UsageRecord[]) {
  const merged = new Map<string, UsageRecord>();
  [...remote, ...local].forEach((record) => {
    const current = merged.get(record.sessionId);
    if (!current || record.lastSeenAt >= current.lastSeenAt) merged.set(record.sessionId, record);
  });
  return [...merged.values()].sort((a, b) => b.startedAt - a.startedAt);
}

export default function SessionUsageTracker() {
  const { sessionId, shortId } = useClientSession();
  const pathname = usePathname();
  const [reportOpen, setReportOpen] = useState(false);
  const [liveOpenMs, setLiveOpenMs] = useState(0);
  const [currentDay, setCurrentDay] = useState('');
  const [records, setRecords] = useState<UsageRecord[]>([]);
  const recordRef = useRef<UsageRecord | null>(null);
  const ownerRef = useRef('');
  const openAnchorRef = useRef(0);
  const visibleAnchorRef = useRef<number | null>(null);
  const pageAnchorRef = useRef(0);
  const pageRef = useRef(pathname);
  const checkpointRef = useRef<(ended?: boolean, remote?: boolean) => UsageRecord | null>(() => null);

  useEffect(() => {
    if (!sessionId) return;
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
    recordRef.current = record;
    openAnchorRef.current = now;
    visibleAnchorRef.current = document.visibilityState === 'visible' ? now : null;
    pageAnchorRef.current = now;
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

      const pageStart = pageAnchorRef.current;
      active.pages[pageRef.current] = (active.pages[pageRef.current] ?? 0) + Math.max(0, timestamp - pageStart);
      pageAnchorRef.current = timestamp;

      if (visibleAnchorRef.current !== null) {
        addAcrossDays(active.dailyVisibleMs, visibleAnchorRef.current, timestamp);
        active.visibleMs += Math.max(0, timestamp - visibleAnchorRef.current);
        visibleAnchorRef.current = timestamp;
      }

      active.lastSeenAt = timestamp;
      active.endedAt = ended ? timestamp : null;
      writeRecord(active);
      setLiveOpenMs(active.openMs);
      if (remote) sendRemote(active, ended);
      return active;
    };
    checkpointRef.current = checkpoint;

    let checkpointCount = 0;
    const displayTimer = window.setInterval(() => {
      const active = recordRef.current;
      if (active?.sessionId === sessionId) {
        const timestamp = Date.now();
        setLiveOpenMs(active.openMs + Math.max(0, timestamp - openAnchorRef.current));
        const today = dayKey(timestamp);
        setCurrentDay((current) => current === today ? current : today);
      }
    }, 100);
    const storageTimer = window.setInterval(() => {
      checkpointCount += 1;
      checkpoint(false, checkpointCount % 5 === 0);
    }, 1000);

    const onVisibilityChange = () => {
      checkpoint(false, true);
      visibleAnchorRef.current = document.visibilityState === 'visible' ? Date.now() : null;
    };
    const onPageHide = () => { checkpoint(true, true); };
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', onPageHide);
    window.addEventListener('beforeunload', onPageHide);

    return () => {
      window.clearInterval(displayTimer);
      window.clearInterval(storageTimer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', onPageHide);
      window.removeEventListener('beforeunload', onPageHide);
      checkpoint(true, true);
      if (recordRef.current?.sessionId === sessionId) recordRef.current = null;
    };
  }, [sessionId]);

  useEffect(() => {
    if (!recordRef.current || pageRef.current === pathname) return;
    checkpointRef.current(false, true);
    pageRef.current = pathname;
    pageAnchorRef.current = Date.now();
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
        const remote = (data.records ?? []).filter(validRecord);
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

  const report = useMemo(() => {
    const totalMs = records.reduce((sum, record) => sum + record.openMs, 0);
    const todayMs = records.reduce((sum, record) => sum + (record.dailyMs[currentDay] ?? 0), 0);
    const visibleTodayMs = records.reduce((sum, record) => sum + (record.dailyVisibleMs[currentDay] ?? 0), 0);
    const pages: NumericMap = {};
    records.forEach((record) => Object.entries(record.pages).forEach(([page, duration]) => {
      pages[page] = (pages[page] ?? 0) + duration;
    }));
    return {
      totalMs,
      todayMs,
      visibleTodayMs,
      pages: Object.entries(pages).sort(([, a], [, b]) => b - a),
    };
  }, [currentDay, records]);

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
        <span>Tempo desta sessão</span>
        <strong>{formatDuration(liveOpenMs, true)}</strong>
      </button>

      {reportOpen && (
        <div className={styles.backdrop} onMouseDown={(event) => {
          if (event.target === event.currentTarget) setReportOpen(false);
        }}>
          <section className={styles.report} role="dialog" aria-modal="true" aria-labelledby="usage-report-title">
            <header className={styles.reportHeader}>
              <div><span>Contagem em milissegundos</span><h2 id="usage-report-title">Relatório de uso</h2></div>
              <button className={styles.closeButton} type="button" onClick={() => setReportOpen(false)} aria-label="Fechar relatório">×</button>
            </header>

            <div className={styles.summaryGrid}>
              <div className={styles.summaryCard}><span>Sessão atual</span><strong>{formatDuration(liveOpenMs)}</strong></div>
              <div className={styles.summaryCard}><span>Hoje · aba aberta</span><strong>{formatDuration(report.todayMs)}</strong></div>
              <div className={styles.summaryCard}><span>Hoje · aba visível</span><strong>{formatDuration(report.visibleTodayMs)}</strong></div>
              <div className={styles.summaryCard}><span>Tempo total</span><strong>{formatDuration(report.totalMs)}</strong></div>
            </div>

            <p className={styles.definition}><b>Aba aberta</b> conta todo o tempo em que o site permanece carregado, mesmo em segundo plano. <b>Aba visível</b> conta somente quando a página está aparecendo na tela.</p>

            <div className={styles.reportSections}>
              <div>
                <h3 className={styles.sectionTitle}>Tempo por área</h3>
                {report.pages.length ? (
                  <ul className={styles.pageList}>
                    {report.pages.map(([page, duration]) => (
                      <li key={page}><span>{PAGE_LABELS[page] ?? page}</span><strong>{formatDuration(duration)}</strong></li>
                    ))}
                  </ul>
                ) : <p className={styles.empty}>O tempo desta sessão aparecerá aqui em alguns segundos.</p>}
              </div>

              <div>
                <h3 className={styles.sectionTitle}>Sessões recentes</h3>
                {records.length ? (
                  <ol className={styles.sessionList}>
                    {records.slice(0, 10).map((record) => (
                      <li key={record.sessionId}>
                        <div className={styles.sessionMain}>
                          <b>{record.sessionId === sessionId ? `Sessão atual · ${shortId}` : `Sessão ${record.sessionId.replaceAll('-', '').slice(0, 8).toUpperCase()}`}</b>
                          <span>{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'medium' }).format(record.startedAt)}</span>
                          <small>{record.endedAt ? 'encerrada' : 'em andamento'}</small>
                        </div>
                        <strong>{formatDuration(record.openMs)}</strong>
                      </li>
                    ))}
                  </ol>
                ) : <p className={styles.empty}>Esta é a primeira sessão registrada.</p>}
              </div>
            </div>

            <p className={styles.privacy}>O relatório começa a contar a partir desta versão. Cada navegador recebe um histórico próprio e cada aba continua sendo uma sessão independente.</p>
          </section>
        </div>
      )}
    </>
  );
}
