import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Dashboard - Agentage Memory' };

export default function DashboardPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
      <span className="mb-5 inline-flex items-center rounded-full border border-border bg-muted/30 px-3 py-1 text-xs text-muted-foreground">
        Coming soon
      </span>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Dashboard</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Manage your memories, connected AI clients, and sync status. Sign-in opens once the MCP
        endpoint is live.
      </p>
      <Link
        href="/"
        className="mt-8 text-sm text-primary underline underline-offset-4 hover:text-primary/80"
      >
        ← Back home
      </Link>
    </section>
  );
}
