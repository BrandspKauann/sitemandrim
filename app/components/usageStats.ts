export type DayStudy = { startedAt: number; lastSeenAt: number; visibleMs: number; pages: Record<string, number> };
export type UsageRecord = {
  ownerId: string; sessionId: string; startedAt: number; lastSeenAt: number; endedAt: number | null;
  openMs: number; visibleMs: number; dailyMs: Record<string, number>;
  dailyVisibleMs: Record<string, number>; pages: Record<string, number>;
  studyDays?: Record<string, DayStudy>;
};

export function dayKey(timestamp: number) {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function trackStudy(record: UsageRecord, page: string, start: number, end: number) {
  if (end <= start) return;
  record.studyDays ??= {};
  let cursor = start;
  while (cursor < end) {
    const date = new Date(cursor);
    const boundary = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).getTime();
    const until = Math.min(end, boundary);
    const key = dayKey(cursor);
    const day = record.studyDays[key] ??= { startedAt: cursor, lastSeenAt: until, visibleMs: 0, pages: {} };
    day.lastSeenAt = until;
    day.visibleMs += until - cursor;
    day.pages[page] = (day.pages[page] ?? 0) + until - cursor;
    cursor = until;
  }
}

export function selectedStats(records: UsageRecord[], from: string, to: string) {
  const days: Record<string, number> = {};
  const pages: Record<string, number> = {};
  const sessions: { id: string; date: string; duration: number; detail?: DayStudy }[] = [];
  let missingDetail = 0;
  records.forEach((record) => Object.entries(record.dailyVisibleMs).forEach(([date, duration]) => {
    if (date < from || date > to || duration <= 0) return;
    days[date] = (days[date] ?? 0) + duration;
    const detail = record.studyDays?.[date];
    sessions.push({ id: record.sessionId, date, duration, detail });
    if (detail) Object.entries(detail.pages).forEach(([page, amount]) => { pages[page] = (pages[page] ?? 0) + amount; });
    missingDetail += Math.max(0, duration - (detail?.visibleMs ?? 0));
  }));
  return { days: Object.entries(days).sort(([a], [b]) => b.localeCompare(a)),
    pages: Object.entries(pages).sort(([,a], [,b]) => b - a),
    sessions: sessions.sort((a,b) => b.date.localeCompare(a.date) || (b.detail?.startedAt ?? 0) - (a.detail?.startedAt ?? 0)),
    total: Object.values(days).reduce((sum, duration) => sum + duration, 0), missingDetail };
}

export function formatDuration(ms: number, tenths = false) {
  const safe = Math.max(0, ms);
  const seconds = Math.floor(safe / 1000);
  const base = [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60].map((n) => String(n).padStart(2, '0')).join(':');
  return tenths ? `${base}.${Math.floor(safe % 1000 / 100)}` : base;
}

export const PAGE_LABELS: Record<string, string> = { '/': 'Frases', '/letras-e-silabas': 'Letras e sílabas', '/exercicios': 'Exercícios', '/tons': 'Tons', '/hsk1': 'HSK1', '/revisao': 'Revisão' };
