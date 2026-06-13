'use client';

import { useRef, useState, type HTMLAttributes } from 'react';
import { Check, Copy } from 'lucide-react';

// Copy-enabled <pre> for blog code blocks. rehype-pretty-code renders per-line
// spans, so there is no plain code string to lift server-side - read
// textContent at click time instead.
export function BlogPre(props: HTMLAttributes<HTMLPreElement>) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    const text = ref.current?.textContent ?? '';
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
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="relative">
      <pre ref={ref} {...props} />
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? 'Copied' : 'Copy code'}
        title={copied ? 'Copied' : 'Copy code'}
        data-slot="copy-button"
        data-copied={copied || undefined}
        className="absolute top-2.5 right-2.5 inline-flex items-center rounded-md border border-border/60 bg-card/80 p-1.5 text-muted-foreground backdrop-blur transition-colors hover:bg-muted/40 hover:text-foreground"
      >
        {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  );
}
