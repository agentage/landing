'use client';

// Interactive, grouped accordion for the six frozen MCP tools on
// /docs/mcp-tools. Sibling to endpoint-list.tsx: it reuses that file's
// SectionLabel plus the shared JsonBlock and chip/chevron patterns, swapping the
// HTTP-method badge for a verb-colored tool badge. Rows collapse via a CSS
// toggle so the contract stays in the prerendered HTML.

import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionLabel } from './endpoint-list';
import { JsonBlock } from './json-highlight';
import type { ToolArg, ToolBadgeColor, ToolContract, ToolGroup } from '@/docs/types';

// Verb semantics -> the same tokens the endpoint method badges use: read = green,
// write = amber, edit = purple, delete = red.
const BADGE_CLASS: Record<ToolBadgeColor, string> = {
  read: 'text-success bg-success/10 border-success/20',
  write: 'text-warning bg-warning/10 border-warning/20',
  edit: 'text-tag-schedules bg-tag-schedules/10 border-tag-schedules/20',
  delete: 'text-destructive bg-destructive/10 border-destructive/20',
};

function ArgTable({ rows }: { rows: ToolArg[] }): React.JSX.Element {
  return (
    <table className="w-full border-collapse">
      <tbody>
        {rows.map((r) => (
          <tr key={r.name}>
            <td className="py-1.5 pr-4 align-top font-mono text-[12px] whitespace-nowrap text-foreground">
              {r.name}
            </td>
            <td className="py-1.5 pr-4 align-top font-mono text-[11px] whitespace-nowrap text-muted-foreground">
              {r.type}
            </td>
            <td className="py-1.5 pr-4 align-top text-[11.5px] whitespace-nowrap text-muted-foreground">
              {r.required}
            </td>
            <td className="w-full py-1.5 align-top text-[12.5px] text-muted-foreground">
              {r.description}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ToolRow({ tool }: { tool: ToolContract }): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const bodyId = React.useId();
  return (
    <article className="overflow-hidden rounded-lg border border-border bg-card">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset"
      >
        <span
          className={cn(
            'inline-grid w-16 place-items-center rounded-md border py-1 font-mono text-[11px] font-bold tracking-wide',
            BADGE_CLASS[tool.color]
          )}
        >
          {tool.verb}
        </span>
        <span className="font-mono text-[13px] text-foreground">{tool.name}</span>
        <span className="hidden flex-1 truncate text-[12.5px] text-muted-foreground sm:inline">
          {tool.summary}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary-soft px-2 py-1 text-[10.5px] leading-none whitespace-nowrap text-primary">
          <span className="size-1.5 rounded-full bg-current" />
          Live · frozen
        </span>
        <ChevronRight
          aria-hidden
          className={cn(
            'size-3.5 shrink-0 text-muted-foreground transition-transform duration-150',
            open && 'rotate-90'
          )}
        />
      </button>
      <div id={bodyId} className={cn('border-t border-border px-4 py-4', !open && 'hidden')}>
        <p className="max-w-[640px] text-[13px] leading-relaxed text-muted-foreground">
          {tool.description}
        </p>
        <SectionLabel>Arguments</SectionLabel>
        <ArgTable rows={tool.args} />
        <SectionLabel>Example input</SectionLabel>
        <JsonBlock code={tool.input} />
        <SectionLabel>Result</SectionLabel>
        <JsonBlock code={tool.result} />
        {tool.behavior && (
          <>
            <SectionLabel>Behavior</SectionLabel>
            <p className="text-[12.5px] leading-relaxed text-muted-foreground">{tool.behavior}</p>
          </>
        )}
      </div>
    </article>
  );
}

export function ToolList({ groups }: { groups: ToolGroup[] }): React.JSX.Element {
  return (
    <div className="my-4">
      {groups.map((g) => (
        <section key={g.group} className="mb-8 last:mb-0">
          <h3 className="mb-3 text-[13px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
            {g.group}
          </h3>
          <div className="space-y-2">
            {g.items.map((t) => (
              <ToolRow key={t.name} tool={t} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
