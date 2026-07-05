import { NextResponse } from 'next/server';

// Container liveness probe (Dockerfile HEALTHCHECK). Standard { success, data }
// envelope + build provenance, matching backend/memory-mcp/auth/dashboard/sync.
// force-dynamic so commit/buildTime are read from the running container's env per
// request (never build-baked).
export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json({
    success: true,
    data: {
      status: 'ok',
      service: 'landing',
      commit: process.env.COMMIT_SHA ?? null,
      buildTime: process.env.BUILD_TIME ?? null,
    },
  });
}
