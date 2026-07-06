'use client';

import { useState } from 'react';
import { Check, Copy, FileText } from 'lucide-react';
import { docMdHref } from '../nav-order';

const btn =
  'inline-flex items-center gap-1.5 rounded-md border border-border/60 px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground';

// Page-header actions: copy this doc as Markdown (fetches the .md sibling), plus a
// plain link to the .md so it works without JS. Mirrors the CopyButton pattern.
export function DocMarkdownActions({ slug }: { slug: string }): React.JSX.Element {
  const [copied, setCopied] = useState(false);
  const href = docMdHref(slug);

  async function copy(): Promise<void> {
    try {
      const md = await (await fetch(href)).text();
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard/fetch can fail outside a secure context; the link is the fallback.
    }
  }

  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <button
        type="button"
        onClick={() => void copy()}
        aria-label={copied ? 'Copied' : 'Copy page as Markdown'}
        title={copied ? 'Copied' : 'Copy page as Markdown'}
        className={btn}
      >
        {copied ? <Check className="size-3 text-success" /> : <Copy className="size-3" />}
        {copied ? 'Copied' : 'Copy page'}
      </button>
      <a href={href} className={btn} title="View as Markdown">
        <FileText className="size-3" />
        Markdown
      </a>
    </div>
  );
}
