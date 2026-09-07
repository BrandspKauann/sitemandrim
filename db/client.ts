import { env } from 'cloudflare:workers';

export function usageDatabase() {
  return (env as Record<string, unknown>).DB as D1Database | undefined;
}
