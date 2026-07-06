import * as React from 'react';
import { ArrowDown } from 'lucide-react';

// The /docs overview diagram: three actor -> surface columns converging on the
// one owned markdown store. Pure server component - static, token-themed.

interface Lane {
  actors: string[];
  actorLabel: string;
  surface: string;
  chip: string;
  href: string;
  host: string;
  blurb: string;
}

const LANES: Lane[] = [
  {
    actorLabel: 'Your AI tools',
    actors: ['Claude', 'Claude Code', 'Cursor', 'VS Code', 'ChatGPT', 'Grok'],
    surface: 'MCP server',
    chip: 'six tools',
    href: '/docs/mcp-server',
    host: 'memory.agentage.io/mcp',
    blurb: 'AIs read and write notes in conversation',
  },
  {
    actorLabel: 'Your scripts & CI',
    actors: ['curl', 'CI jobs', 'integrations'],
    surface: 'REST API',
    chip: 'v1',
    href: '/docs/rest-api',
    host: 'api.agentage.io/v1',
    blurb: 'Read-only HTTP with the same OAuth token',
  },
  {
    actorLabel: 'Your files on disk',
    actors: ['Obsidian', 'git', 'CLI'],
    surface: 'Sync',
    chip: 'git-powered',
    href: '/docs/mcp-server',
    host: 'sync.agentage.io',
    blurb: 'A plain-files mirror of the memory',
  },
];

function DownArrow(): React.JSX.Element {
  return (
    <div className="flex justify-center py-1.5 text-muted-foreground/70">
      <ArrowDown className="h-4 w-4" aria-hidden />
    </div>
  );
}

export function MemoryMapDiagram(): React.JSX.Element {
  return (
    <figure className="my-6">
      <div className="grid gap-3 sm:grid-cols-3">
        {LANES.map((lane) => (
          <div key={lane.surface} className="flex flex-col">
            <div className="rounded-lg border border-dashed border-border px-3 py-2.5 text-center">
              <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                {lane.actorLabel}
              </div>
              <div className="mt-1.5 flex flex-wrap justify-center gap-1">
                {lane.actors.map((a) => (
                  <span
                    key={a}
                    className="rounded-full border border-border px-2 py-0.5 text-[10.5px] text-muted-foreground"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
            <DownArrow />
            <a
              href={lane.href}
              className="flex-1 rounded-lg border border-border bg-card px-3 py-2.5 text-center no-underline transition-colors hover:border-primary/40"
            >
              <div className="flex items-center justify-center gap-2 text-[13.5px] font-semibold text-foreground">
                {lane.surface}
                <span className="rounded-full border border-primary/25 bg-primary-soft px-2 py-0.5 text-[9.5px] font-medium text-primary">
                  {lane.chip}
                </span>
              </div>
              <div className="mt-0.5 font-mono text-[10.5px] text-muted-foreground">
                {lane.host}
              </div>
              <div className="mt-1 text-[11.5px] leading-snug text-muted-foreground">
                {lane.blurb}
              </div>
            </a>
            <DownArrow />
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-primary/25 bg-primary-soft px-4 py-4 text-center">
        <div className="text-[14px] font-semibold text-foreground">Your memory</div>
        <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
          plain markdown, addressed by path - work/tasks/foo.md
        </div>
        <div className="mt-1 text-[11.5px] text-muted-foreground">
          One store behind every surface: a git repo per vault, EU-hosted, exportable anytime.
        </div>
      </div>
      <figcaption className="mt-2 text-center text-[11.5px] text-muted-foreground">
        One OAuth account everywhere - no API keys. You own the files.
      </figcaption>
    </figure>
  );
}
