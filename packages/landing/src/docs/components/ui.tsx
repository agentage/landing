'use client';

// Docs-only primitives the design system does not cover: `Md` needs per-node
// component overrides (fenced blocks route to the highlighted CodeBlock) and
// `CodeBlock` needs bash/json tokenizing - neither is expressible via
// DS markdown/code-block today. Everything else comes from the DS subpaths.

import * as React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@agentage/design-system/utils';
import { tokenizeBash } from '@/components/docs/bash-highlight';
import { normalizeJson, tokenizeJson, type Piece } from '@/components/docs/json-highlight';

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
// Pick a tokenizer by language. bash/sh keep the exact source so the copy button
// stays byte-accurate; json is normalized (JSON.parse/stringify) before coloring,
// matching JsonBlock. Everything else renders as plain text.
function highlight(code: string, language?: string): { pieces: Piece[] | null; text: string } {
  const lang = language?.toLowerCase();
  if (lang === 'bash' || lang === 'sh' || lang === 'shell') {
    return { pieces: tokenizeBash(code), text: code };
  }
  if (lang === 'json') {
    const { text, highlighted } = normalizeJson(code);
    return { pieces: highlighted ? tokenizeJson(text) : null, text };
  }
  return { pieces: null, text: code };
}

export function CodeBlock({
  code,
  language,
}: {
  code: string;
  language?: string;
}): React.JSX.Element {
  const [copied, setCopied] = React.useState(false);
  const { pieces, text } = highlight(code, language);
  const copy = async (): Promise<void> => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="font-mono text-xs text-muted-foreground">{language ?? 'text'}</span>
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
        <code className="font-mono text-foreground">
          {pieces
            ? pieces.map((p, i) =>
                p.className ? (
                  <span key={i} className={p.className}>
                    {p.text}
                  </span>
                ) : (
                  <React.Fragment key={i}>{p.text}</React.Fragment>
                )
              )
            : text}
        </code>
      </pre>
    </div>
  );
}
