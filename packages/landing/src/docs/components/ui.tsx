'use client';

// SSR-safe local primitives for the docs pages. We intentionally do NOT import
// the @agentage/design-system JS barrel: it is a browser bundle whose markdown
// chunk touches `document` at module eval and crashes server rendering. Only the
// design-system *tokens* (theme.css) are used, via globals.css. These are trimmed
// copies of the DS components wired to the local `cn`.

import * as React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// --- Markdown -------------------------------------------------------------
const proseClass = cn(
  'text-[15px] leading-relaxed text-foreground',
  '[&_p]:my-3 [&_strong]:font-semibold [&_strong]:text-foreground',
  '[&_a]:border-b [&_a]:border-primary/30 [&_a]:text-primary hover:[&_a]:border-primary',
  '[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:marker:text-primary [&_li]:my-1.5',
  '[&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1.5',
  // Inline code only - fenced blocks render via the copyable CodeBlock (see Md).
  '[&_:not(pre)>code]:rounded [&_:not(pre)>code]:border [&_:not(pre)>code]:border-border [&_:not(pre)>code]:bg-card [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-[0.85em]',
  '[&_table]:my-4 [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:border-collapse [&_table]:text-sm',
  '[&_th]:border-b [&_th]:border-border [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:whitespace-nowrap',
  '[&_td]:border-b [&_td]:border-border/60 [&_td]:px-3 [&_td]:py-2 [&_td]:align-top'
);

export function Md({
  children,
  className,
}: {
  children: string;
  className?: string;
}): React.JSX.Element {
  return (
    <div className={cn(proseClass, className)}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => {
            const external = !!href && /^https?:\/\//.test(href);
            return (
              <a
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {children}
              </a>
            );
          },
          // Unwrap <pre>; the `code` renderer emits the copyable CodeBlock.
          pre: ({ children }) => <>{children}</>,
          code: ({ className, children }) => {
            const lang = /language-(\w+)/.exec(className ?? '')?.[1];
            const text = String(children ?? '').replace(/\n$/, '');
            if (lang || text.includes('\n')) {
              return (
                <div className="my-3">
                  <CodeBlock code={text} language={lang} />
                </div>
              );
            }
            return <code className={className}>{children}</code>;
          },
        }}
      >
        {children}
      </Markdown>
    </div>
  );
}

// --- CodeBlock ------------------------------------------------------------
export function CodeBlock({
  code,
  language,
}: {
  code: string;
  language?: string;
}): React.JSX.Element {
  const [copied, setCopied] = React.useState(false);
  const copy = async (): Promise<void> => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="font-mono text-xs text-muted-foreground">{language ?? 'shell'}</span>
        <button
          type="button"
          onClick={() => void copy()}
          className="rounded px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13.5px] leading-relaxed">
        <code className="font-mono text-foreground">{code}</code>
      </pre>
    </div>
  );
}

// --- Alert ----------------------------------------------------------------
const alertVariants = cva(
  'flex gap-3 rounded-lg border p-4 text-sm [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'border-border bg-card text-card-foreground',
        success: 'border-success/30 bg-success/10 text-success',
        warning: 'border-warning/30 bg-warning/10 text-warning',
        info: 'border-info/30 bg-info/10 text-info',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export function Alert({
  className,
  variant,
  icon,
  children,
}: React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants> & { icon?: React.ReactNode }): React.JSX.Element {
  return (
    <div role="alert" className={cn(alertVariants({ variant }), className)}>
      {icon}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

// --- Tabs -----------------------------------------------------------------
const TabsCtx = React.createContext<{ value: string; set: (v: string) => void; id: string }>({
  value: '',
  set: () => {},
  id: '',
});

const tabIds = (id: string, value: string): { tab: string; panel: string } => ({
  tab: `${id}-tab-${value}`,
  panel: `${id}-panel-${value}`,
});

export function Tabs({
  defaultValue = '',
  className,
  children,
}: {
  defaultValue?: string;
  className?: string;
  children: React.ReactNode;
}): React.JSX.Element {
  const [value, set] = React.useState(defaultValue);
  const id = React.useId();
  return (
    <TabsCtx.Provider value={{ value, set, id }}>
      <div className={cn('flex flex-col', className)}>{children}</div>
    </TabsCtx.Provider>
  );
}

export function TabsList({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div
      role="tablist"
      className="inline-flex items-center gap-1 self-start rounded-lg bg-muted p-1"
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}): React.JSX.Element {
  const ctx = React.useContext(TabsCtx);
  const active = ctx.value === value;
  const ids = tabIds(ctx.id, value);
  return (
    <button
      type="button"
      role="tab"
      id={ids.tab}
      aria-controls={ids.panel}
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      onClick={() => ctx.set(value)}
      className={cn(
        'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground'
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}): React.JSX.Element | null {
  const ctx = React.useContext(TabsCtx);
  if (ctx.value !== value) return null;
  const ids = tabIds(ctx.id, value);
  return (
    <div role="tabpanel" id={ids.panel} aria-labelledby={ids.tab} className="mt-3">
      {children}
    </div>
  );
}
