'use client';

// Tiny bash/sh tokenizer for the docs code blocks. Mirrors json-highlight.tsx:
// a small regex-based tokenizer that colors tokens with the landing's semantic
// tokens (works light + dark), so we avoid pulling shiki into the client
// island. Rendering + the copy button live in the shared CodeBlock; this file
// only turns a string into colored Pieces.

import type { Piece } from './json-highlight';

// Leading command word of a line gets the primary tint.
const COMMANDS = new Set(['npm', 'npx', 'agentage', 'curl', 'claude', 'git', 'node', 'bash', 'sh']);

const CLASS = {
  comment: 'text-muted-foreground',
  command: 'text-primary',
  flag: 'text-info',
  string: 'text-success',
  placeholder: 'text-tag-schedules',
} as const;

// whitespace | quoted string | <placeholder>/@<placeholder> | -flag/--flag | word
const TOKEN =
  /(\s+)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(@?<[^>]+>)|(--?[A-Za-z][\w-]*)|([^\s"']+)/g;

// A `#` starts a comment only at a word boundary and outside quotes.
function commentStart(line: string): number {
  let quote = '';
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (quote) {
      if (c === '\\') i++;
      else if (c === quote) quote = '';
      continue;
    }
    if (c === '"' || c === "'") quote = c;
    else if (c === '#' && (i === 0 || /\s/.test(line[i - 1]))) return i;
  }
  return -1;
}

function tokenizeLine(line: string, out: Piece[]): void {
  const cut = commentStart(line);
  const code = cut === -1 ? line : line.slice(0, cut);
  let seenWord = false;
  TOKEN.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = TOKEN.exec(code)) !== null) {
    const [, ws, str, ph, flag, word] = m;
    if (ws !== undefined) {
      out.push({ text: ws });
    } else if (str !== undefined) {
      out.push({ text: str, className: CLASS.string });
      seenWord = true;
    } else if (ph !== undefined) {
      out.push({ text: ph, className: CLASS.placeholder });
      seenWord = true;
    } else if (flag !== undefined) {
      out.push({ text: flag, className: CLASS.flag });
      seenWord = true;
    } else {
      const command = !seenWord && COMMANDS.has(word);
      out.push({ text: word, className: command ? CLASS.command : undefined });
      seenWord = true;
    }
  }
  if (cut !== -1) out.push({ text: line.slice(cut), className: CLASS.comment });
}

export function tokenizeBash(code: string): Piece[] {
  const out: Piece[] = [];
  code.split('\n').forEach((line, i) => {
    if (i > 0) out.push({ text: '\n' });
    tokenizeLine(line, out);
  });
  return out;
}
