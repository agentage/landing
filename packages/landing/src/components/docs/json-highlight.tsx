'use client';

// Structured, syntax-highlighted JSON for the endpoint response blocks. We avoid
// pulling shiki into this client island (async + heavy); a tiny tokenizer colors
// keys/strings/numbers/booleans/null via the landing's semantic tokens, so it
// works in both light and dark themes. Responses are normalized through
// JSON.parse/stringify (2-space) - nothing is hand-aligned.

import * as React from 'react';

interface Piece {
  text: string;
  className?: string;
}

// Alternation: quoted string (optionally a key when followed by a colon),
// literal keyword, or number.
const TOKEN =
  /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;

function tokenize(json: string): Piece[] {
  const pieces: Piece[] = [];
  let last = 0;
  TOKEN.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = TOKEN.exec(json)) !== null) {
    if (m.index > last) pieces.push({ text: json.slice(last, m.index) });
    const [full, str, colon, keyword] = m;
    if (str !== undefined) {
      if (colon !== undefined) {
        pieces.push({ text: str, className: 'text-info' });
        pieces.push({ text: colon });
      } else {
        pieces.push({ text: str, className: 'text-success' });
      }
    } else if (keyword !== undefined) {
      pieces.push({ text: full, className: 'text-tag-schedules' });
    } else {
      pieces.push({ text: full, className: 'text-warning' });
    }
    last = m.index + full.length;
  }
  if (last < json.length) pieces.push({ text: json.slice(last) });
  return pieces;
}

function normalize(code: string): { text: string; highlighted: boolean } {
  try {
    return { text: JSON.stringify(JSON.parse(code), null, 2), highlighted: true };
  } catch {
    return { text: code, highlighted: false };
  }
}

export function JsonBlock({ code }: { code: string }): React.JSX.Element {
  const [copied, setCopied] = React.useState(false);
  const { text, highlighted } = normalize(code);
  const copy = async (): Promise<void> => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="font-mono text-xs text-muted-foreground">
          {highlighted ? 'json' : 'text'}
        </span>
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
          {highlighted
            ? tokenize(text).map((p, i) =>
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
