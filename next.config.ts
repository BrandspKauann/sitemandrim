import type { NextConfig } from 'next';

const isVinext = process.env.npm_lifecycle_event?.startsWith('sites:')
  || process.argv.some((argument) => argument.toLowerCase().includes('vinext'));

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
    resolveAlias: isVinext ? undefined : {
      'cloudflare:workers': './app/cloudflare-workers-stub.ts',
    },
  },
};

export default nextConfig;
