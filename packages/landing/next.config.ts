import type { NextConfig } from 'next';

// In prod the platform routes /api/* to the API before Next.js sees the
// request. `next dev` has no proxy, so fetch('/api/...') would 404 - this
// rewrite fills that gap in development only; prod behavior is unchanged.
const devApiUrl = process.env.BACKEND_URL ?? 'http://127.0.0.1:3001';

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    const always = [
      // Always-on: serve the MCP-registry domain-verification file at its well-known path off a plain route (leading-dot app segments are unreliable across Next).
      { source: '/.well-known/mcp-registry-auth', destination: '/mcp-registry-auth' },
      // /blog/<slug>.md → markdown mirror for agents (route handler at /blog-md/<slug>).
      { source: '/blog/:slug.md', destination: '/blog-md/:slug' },
    ];
    if (process.env.NODE_ENV === 'production') return always;
    return [...always, { source: '/api/:path*', destination: `${devApiUrl}/api/:path*` }];
  },
};

export default nextConfig;
