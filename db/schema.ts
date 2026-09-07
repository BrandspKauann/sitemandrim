import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const usageSessions = sqliteTable('usage_sessions', {
  ownerId: text('owner_id').notNull(),
  sessionId: text('session_id').notNull(),
  startedAt: integer('started_at').notNull(),
  lastSeenAt: integer('last_seen_at').notNull(),
  endedAt: integer('ended_at'),
  openMs: integer('open_ms').notNull().default(0),
  visibleMs: integer('visible_ms').notNull().default(0),
  dailyJson: text('daily_json').notNull().default('{}'),
  dailyVisibleJson: text('daily_visible_json').notNull().default('{}'),
  pagesJson: text('pages_json').notNull().default('{}'),
}, (table) => [
  primaryKey({ columns: [table.ownerId, table.sessionId] }),
]);
