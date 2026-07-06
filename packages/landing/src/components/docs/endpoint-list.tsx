'use client';

// Interactive, grouped endpoint accordion for /docs/rest-api. Reproduces the
// approved prototype (_archive/proto/api-reference-page) against the landing's
// semantic tokens. Rows collapse via a CSS toggle so the contract stays in the
// prerendered HTML; each row opens independently.

import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/docs/components/ui';
import { JsonBlock } from './json-highlight';
import type { Endpoint, EndpointArg, EndpointGroup, HttpMethod } from '@/docs/types';

const METHOD_CLASS: Record<HttpMethod, string> = {
  GET: 'text-success bg-success/10 border-success/20',
  POST: 'text-info bg-info/10 border-info/20',
  PUT: 'text-warning bg-warning/10 border-warning/20',
  PATCH: 'text-tag-schedules bg-tag-schedules/10 border-tag-schedules/20',
  DELETE: 'text-destructive bg-destructive/10 border-destructive/20',
};

function SectionLabel({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <p className="mt-4 mb-1.5 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
      {children}
    </p>
  );
}

function ArgTable({ rows }: { rows: EndpointArg[] }): React.JSX.Element {
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
            <td className="w-full py-1.5 align-top text-[12.5px] text-muted-foreground">
              {r.description}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function EndpointRow({ endpoint }: { endpoint: Endpoint }): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const bodyId = React.useId();
  const planned = endpoint.status === 'planned';
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
            METHOD_CLASS[endpoint.method]
          )}
        >
          {endpoint.method}
        </span>
        <span className="font-mono text-[13px] text-foreground">{endpoint.path}</span>
        <span className="hidden flex-1 truncate text-[12.5px] text-muted-foreground sm:inline">
          {endpoint.summary}
        </span>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10.5px] leading-none whitespace-nowrap',
            planned
              ? 'border-border text-muted-foreground'
              : 'border-primary/25 bg-primary-soft text-primary'
          )}
        >
          <span className="size-1.5 rounded-full bg-current" />
          {planned ? `Planned · wave ${endpoint.wave}` : 'Live'}
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
          {endpoint.description}
        </p>
        {planned && (
          <p className="mt-2 text-[12px] text-warning">
            Draft contract from the north-star spec. Not callable yet.
          </p>
        )}
        {endpoint.params && (
          <>
            <SectionLabel>Parameters</SectionLabel>
            <ArgTable rows={endpoint.params} />
          </>
        )}
        <SectionLabel>Example</SectionLabel>
        <CodeBlock code={endpoint.curl} language="bash" />
        <SectionLabel>Response 200</SectionLabel>
        <JsonBlock code={endpoint.response} />
        <SectionLabel>Fields</SectionLabel>
        <ArgTable rows={endpoint.fields} />
        <SectionLabel>Errors</SectionLabel>
        <p className="text-[12.5px] text-muted-foreground">
          {endpoint.errors.map((e, i) => (
            <React.Fragment key={e.status}>
              {i > 0 && <span> · </span>}
              <span className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[11.5px]">
                {e.status}
              </span>{' '}
              {e.meaning}
            </React.Fragment>
          ))}
        </p>
      </div>
    </article>
  );
}

export function EndpointList({ groups }: { groups: EndpointGroup[] }): React.JSX.Element {
  return (
    <div className="my-4">
      {groups.map((g) => (
        <section key={g.group} className="mb-8 last:mb-0">
          <h3 className="mb-3 text-[13px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
            {g.group}
          </h3>
          <div className="space-y-2">
            {g.items.map((e) => (
              <EndpointRow key={`${e.method} ${e.path}`} endpoint={e} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
