import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Dashboard - Agentage Memory' };

// In production the platform routes /dashboard to the real dashboard app (higher
// Traefik priority), so this route is only reached when the landing is served on
// its own (local dev / standalone). It is a graceful fallback that points at the
// connect flow, not a "coming soon" placeholder - the endpoint is live.
export default function DashboardPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
      <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/30 px-3 py-1 text-xs text-muted-foreground">
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/60" />
          <span className="relative inline-flex size-1.5 rounded-full bg-success" />
        </span>
        Live
      </span>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Dashboard</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Your memories and connected AI clients live here once you sign in. Connect an AI to
        memory.agentage.io/mcp and signing in creates your account.
      </p>
      <Link
        href="/docs"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
      >
        Connect an AI →
      </Link>
      <Link
        href="/"
        className="mt-5 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
      >
        ← Back home
      </Link>
    </section>
  );
}
