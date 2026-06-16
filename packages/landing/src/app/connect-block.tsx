'use client';

import { useState } from 'react';
import {
  CHATGPT_CONNECTORS_URL,
  CLAUDE_ADD_URL,
  CLAUDE_CODE_COMMAND,
  CURSOR_ADD_URL,
  MCP_ENDPOINT_URL,
  VSCODE_ADD_URL,
  VSCODE_MCP_JSON,
} from '../lib/mcp-docs';
import { CopyButton } from './docs/copy-button';

type Step = {
  text?: string;
  snippet?: string;
  link?: string;
  linkLabel?: string;
  cta?: string;
  ctaLabel?: string;
};
type Tab = { key: string; label: string; steps: readonly Step[] };

const USE_STEP = 'Ask it to save or recall a note - every AI you connect shares the same memory.';

const TABS: readonly Tab[] = [
  {
    key: 'claude-code',
    label: 'Claude Code',
    steps: [
      { snippet: CLAUDE_CODE_COMMAND },
      { text: 'Run /mcp and sign in - a new account is created on first connect.' },
      { text: USE_STEP },
    ],
  },
  {
    key: 'claude',
    label: 'Claude.ai',
    steps: [
      { cta: CLAUDE_ADD_URL, ctaLabel: 'Add to Claude' },
      {
        text: 'Opens Claude.ai with the server prefilled - review, confirm, and sign in. Works in Claude Desktop too.',
      },
      { text: USE_STEP },
    ],
  },
  {
    key: 'vscode',
    label: 'VS Code',
    steps: [
      { cta: VSCODE_ADD_URL, ctaLabel: 'Install in VS Code' },
      { snippet: VSCODE_MCP_JSON },
      {
        text: 'One click installs it, or add the JSON to .vscode/mcp.json. Opens the browser to sign in.',
      },
    ],
  },
  {
    key: 'cursor',
    label: 'Cursor',
    steps: [
      { cta: CURSOR_ADD_URL, ctaLabel: 'Add to Cursor' },
      { text: 'Installs the server in Cursor, then sign in when prompted.' },
      { text: USE_STEP },
    ],
  },
  {
    key: 'chatgpt',
    label: 'ChatGPT',
    steps: [
      { link: CHATGPT_CONNECTORS_URL, linkLabel: 'Open ChatGPT Apps & Connectors' },
      {
        text: 'In Advanced settings, enable Developer Mode, click Create, paste the endpoint, and sign in (paid plans, not Free - ChatGPT has no one-click link yet).',
      },
      { text: USE_STEP },
    ],
  },
];

function EndpointSlice() {
  return (
    <div className="mb-4 flex items-center gap-2 rounded-lg border border-border/60 bg-[#0b0b0e] px-3 py-2.5">
      <span className="relative flex size-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/60" />
        <span className="relative inline-flex size-2 rounded-full bg-success" />
      </span>
      <code className="flex-1 break-all font-mono text-sm text-foreground">{MCP_ENDPOINT_URL}</code>
      <CopyButton text={MCP_ENDPOINT_URL} iconOnly />
    </div>
  );
}

function StepBody({ step }: { step: Step }) {
  if (step.cta) {
    return (
      <a
        href={step.cta}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[12px] font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-colors hover:bg-primary/90"
      >
        {step.ctaLabel} ↗
      </a>
    );
  }
  if (step.snippet) {
    return (
      <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-[#0b0b0e] p-3">
        <pre className="flex-1 overflow-x-auto font-mono text-[12px] leading-relaxed text-muted-foreground">
          {step.snippet}
        </pre>
        <CopyButton text={step.snippet} iconOnly />
      </div>
    );
  }
  if (step.link) {
    return (
      <a
        href={step.link}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center pt-0.5 font-mono text-[12px] text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
      >
        {step.linkLabel} ↗
      </a>
    );
  }
  return <p className="pt-1 text-[12px] leading-relaxed text-muted-foreground">{step.text}</p>;
}

// Stepped connect block: blinking endpoint on top (outside the pane); underline tabs
// (active = solid amber, inactive = soft amber); fixed-height numbered guide.
export function ConnectBlock() {
  const [tabKey, setTabKey] = useState('claude-code');
  const active = TABS.find((t) => t.key === tabKey) ?? TABS[0];

  return (
    <div className="text-left">
      <EndpointSlice />

      <div className="rounded-xl border border-border bg-background/40 p-4">
        {/* Underline tabs - amber bar via bg-primary (border-primary is overridden by
            the DS global border-color reset). Active solid amber, inactive soft amber. */}
        <div className="flex flex-wrap gap-4 border-b border-border/60">
          {TABS.map((t) => {
            const isActive = t.key === tabKey;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTabKey(t.key)}
                aria-pressed={isActive}
                className={
                  isActive
                    ? 'relative pb-2.5 text-[12px] font-medium text-primary'
                    : 'group relative pb-2.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground'
                }
              >
                {t.label}
                <span
                  className={
                    isActive
                      ? 'absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-primary'
                      : 'absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-primary/40 transition-colors group-hover:bg-primary'
                  }
                />
              </button>
            );
          })}
        </div>

        {/* Fixed-height numbered guide */}
        <ol className="mt-4 min-h-[16rem] space-y-3">
          {active.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-muted/30 font-mono text-[11px] text-primary">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <StepBody step={step} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
