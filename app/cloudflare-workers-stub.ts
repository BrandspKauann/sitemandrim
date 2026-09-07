// The regular Next.js build has no Cloudflare bindings. Vinext ignores this
// Turbopack-only alias and uses the native `cloudflare:workers` module.
export const env: Record<string, unknown> = {};
