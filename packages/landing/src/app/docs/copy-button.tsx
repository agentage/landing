'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

// Local mirror of @agentage/design-system CopyButton (same API surface:
// text/label/successLabel/duration). Landing must not import the DS JS barrel
// (client-only module scope breaks `next build` prerender - see lib/utils.ts),
// and the DS exports map exposes no per-component subpath.
export function CopyButton({
  text,
  label = 'Copy',
  successLabel = 'Copied',
  duration = 1500,
  iconOnly = false,
}: {
  text: string;
  label?: string;
  successLabel?: string;
  duration?: number;
  iconOnly?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API needs a secure context + focus; fall back to execCommand.
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), duration);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? successLabel : label}
      title={copied ? successLabel : label}
      data-slot="copy-button"
      data-copied={copied || undefined}
      className={
        iconOnly
          ? 'inline-flex items-center rounded p-1 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground'
          : 'ml-auto inline-flex items-center gap-1.5 rounded-md border border-border/60 px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground'
      }
    >
      {copied ? <Check className="size-3 text-success" /> : <Copy className="size-3" />}
      {!iconOnly && (copied ? successLabel : label)}
    </button>
  );
}
