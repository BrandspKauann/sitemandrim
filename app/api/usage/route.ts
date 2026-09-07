import { usageDatabase } from '../../../db/client';

const ID_PATTERN = /^[a-zA-Z0-9-]{8,80}$/;
const MAX_DURATION_MS = 20 * 365 * 24 * 60 * 60 * 1000;
const MAX_RECORDS = 1000;

type NumericMap = Record<string, number>;

type UsagePayload = {
  ownerId?: unknown;
  sessionId?: unknown;
  startedAt?: unknown;
  lastSeenAt?: unknown;
  endedAt?: unknown;
  openMs?: unknown;
  visibleMs?: unknown;
  dailyMs?: unknown;
  dailyVisibleMs?: unknown;
  pages?: unknown;
};

function databaseUnavailable() {
  return Response.json({ error: 'O relatório de uso não está disponível agora.' }, { status: 503 });
}

function finiteInteger(value: unknown, minimum: number, maximum: number) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  const integer = Math.round(value);
  return integer >= minimum && integer <= maximum ? integer : null;
}

function cleanMap(value: unknown, keyPattern: RegExp, maximumEntries: number): NumericMap | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const entries = Object.entries(value).slice(0, maximumEntries);
  const cleaned: NumericMap = {};
  for (const [key, amount] of entries) {
    const milliseconds = finiteInteger(amount, 0, MAX_DURATION_MS);
    if (!keyPattern.test(key) || milliseconds === null) return null;
    cleaned[key] = milliseconds;
  }
  return cleaned;
}

function cleanPayload(payload: UsagePayload) {
  if (typeof payload.ownerId !== 'string' || !ID_PATTERN.test(payload.ownerId)
    || typeof payload.sessionId !== 'string' || !ID_PATTERN.test(payload.sessionId)) return null;

  const now = Date.now();
  const startedAt = finiteInteger(payload.startedAt, 1_577_836_800_000, now + 86_400_000);
  const lastSeenAt = finiteInteger(payload.lastSeenAt, 1_577_836_800_000, now + 86_400_000);
  const openMs = finiteInteger(payload.openMs, 0, MAX_DURATION_MS);
  const visibleMs = finiteInteger(payload.visibleMs, 0, MAX_DURATION_MS);
  const endedAt = payload.endedAt === null
    ? null
    : finiteInteger(payload.endedAt, 1_577_836_800_000, now + 86_400_000);
  const dailyMs = cleanMap(payload.dailyMs, /^\d{4}-\d{2}-\d{2}$/, 7400);
  const dailyVisibleMs = cleanMap(payload.dailyVisibleMs, /^\d{4}-\d{2}-\d{2}$/, 7400);
  const pages = cleanMap(payload.pages, /^\/[a-zA-Z0-9/_-]{0,119}$/, 40);

  if (startedAt === null || lastSeenAt === null || endedAt === null && payload.endedAt !== null
    || openMs === null || visibleMs === null || !dailyMs || !dailyVisibleMs || !pages) return null;

  return {
    ownerId: payload.ownerId,
    sessionId: payload.sessionId,
    startedAt,
    lastSeenAt,
    endedAt,
    openMs,
    visibleMs,
    dailyMs,
    dailyVisibleMs,
    pages,
  };
}

export async function POST(request: Request) {
  const database = usageDatabase();
  if (!database) return databaseUnavailable();

  const body = await request.json().catch(() => null) as UsagePayload | null;
  const payload = body ? cleanPayload(body) : null;
  if (!payload) return Response.json({ error: 'Relatório inválido.' }, { status: 400 });

  await database.prepare(`
    INSERT INTO usage_sessions (
      owner_id, session_id, started_at, last_seen_at, ended_at,
      open_ms, visible_ms, daily_json, daily_visible_json, pages_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(owner_id, session_id) DO UPDATE SET
      started_at = MIN(usage_sessions.started_at, excluded.started_at),
      last_seen_at = MAX(usage_sessions.last_seen_at, excluded.last_seen_at),
      ended_at = excluded.ended_at,
      open_ms = MAX(usage_sessions.open_ms, excluded.open_ms),
      visible_ms = MAX(usage_sessions.visible_ms, excluded.visible_ms),
      daily_json = excluded.daily_json,
      daily_visible_json = excluded.daily_visible_json,
      pages_json = excluded.pages_json
    WHERE excluded.last_seen_at >= usage_sessions.last_seen_at
  `).bind(
    payload.ownerId,
    payload.sessionId,
    payload.startedAt,
    payload.lastSeenAt,
    payload.endedAt,
    payload.openMs,
    payload.visibleMs,
    JSON.stringify(payload.dailyMs),
    JSON.stringify(payload.dailyVisibleMs),
    JSON.stringify(payload.pages),
  ).run();

  return Response.json({ ok: true });
}

function parseStoredMap(value: unknown): NumericMap {
  if (typeof value !== 'string') return {};
  try {
    const parsed = JSON.parse(value) as unknown;
    return cleanMap(parsed, /^.{1,120}$/, 7400) ?? {};
  } catch {
    return {};
  }
}

export async function GET(request: Request) {
  const database = usageDatabase();
  if (!database) return databaseUnavailable();

  const ownerId = new URL(request.url).searchParams.get('owner') ?? '';
  if (!ID_PATTERN.test(ownerId)) return Response.json({ error: 'Relatório inválido.' }, { status: 400 });

  const result = await database.prepare(`
    SELECT owner_id, session_id, started_at, last_seen_at, ended_at,
      open_ms, visible_ms, daily_json, daily_visible_json, pages_json
    FROM usage_sessions
    WHERE owner_id = ?
    ORDER BY last_seen_at DESC
    LIMIT ?
  `).bind(ownerId, MAX_RECORDS).all<Record<string, unknown>>();

  const records = result.results.map((row) => ({
    ownerId: String(row.owner_id),
    sessionId: String(row.session_id),
    startedAt: Number(row.started_at),
    lastSeenAt: Number(row.last_seen_at),
    endedAt: row.ended_at === null ? null : Number(row.ended_at),
    openMs: Number(row.open_ms),
    visibleMs: Number(row.visible_ms),
    dailyMs: parseStoredMap(row.daily_json),
    dailyVisibleMs: parseStoredMap(row.daily_visible_json),
    pages: parseStoredMap(row.pages_json),
  }));

  return Response.json({ records }, { headers: { 'Cache-Control': 'private, no-store' } });
}
