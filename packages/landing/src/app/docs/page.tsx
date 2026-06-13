import type { Metadata } from 'next';
import Link from 'next/link';
import {
  CHATGPT_CONNECTORS_URL,
  CLAUDE_CODE_COMMAND,
  CLAUDE_CONNECTORS_URL,
  EXAMPLE_PROMPTS,
  LIMITATIONS,
  MCP_ENDPOINT_URL,
  MCP_TOOLS,
  VSCODE_MCP_JSON,
} from '../../lib/mcp-docs';
import { CopyButton } from './copy-button';

export const metadata: Metadata = {
  title: 'Docs - Agentage Memory',
  description:
    'Get started with Agentage Memory: connect Claude, ChatGPT, Cursor, and Obsidian to one shared markdown memory through a single MCP endpoint.',
  alternates: { canonical: '/docs' },
  openGraph: { url: '/docs' },
};

type Line = { t: string; kind?: 'cmd' | 'ok' | 'dim' };

function Terminal({ title, lines, copy }: { title: string; lines: Line[]; copy?: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-[#0b0b0e] shadow-2xl shadow-black/40">
      <div className="flex items-center gap-1.5 border-b border-border/60 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-destructive/70" />
        <span className="size-2.5 rounded-full bg-warning/70" />
        <span className="size-2.5 rounded-full bg-success/70" />
        <span className="ml-2 font-mono text-[11px] text-muted-foreground">{title}</span>
        {copy && <CopyButton text={copy} />}
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-relaxed">
        {lines.map((l, i) => (
          <div
            key={i}
            className={
              l.kind === 'ok'
                ? 'text-success'
                : l.kind === 'cmd'
                  ? 'text-foreground'
                  : 'text-muted-foreground'
            }
          >
            {l.kind === 'cmd' && <span className="text-primary">$ </span>}
            {l.kind === 'dim' && <span className="text-muted-foreground">{'↳ '}</span>}
            {l.t}
          </div>
        ))}
      </pre>
    </div>
  );
}

function Section({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border/50 bg-sidebar/40 p-6 md:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-bold tracking-tight md:text-2xl">{title}</h2>
        {badge && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/30 px-2.5 py-0.5 text-xs text-muted-foreground">
            {badge === 'Live' && (
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-success" />
              </span>
            )}
            {badge}
          </span>
        )}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Steps({ items }: { items: { title: string; body: React.ReactNode }[] }) {
  return (
    <ol className="space-y-6">
      {items.map((s, i) => (
        <li key={i} className="flex gap-4">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-muted/30 font-mono text-xs text-primary">
            {i + 1}
          </span>
          <div className="flex-1 space-y-1.5 pt-0.5">
            <h3 className="font-semibold text-foreground">{s.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Endpoint() {
  return (
    <span className="inline-flex items-center gap-1.5">
      <code className="rounded bg-muted px-1.5 py-0.5 text-[13px]">{MCP_ENDPOINT_URL}</code>
      <CopyButton text={MCP_ENDPOINT_URL} iconOnly />
    </span>
  );
}

function EndpointCopy() {
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <Endpoint />
      <span>- then sign in when prompted.</span>
    </span>
  );
}

function ClientCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-5">
      <h3 className="mb-4 font-semibold text-foreground">{title}</h3>
      {children}
    </div>
  );
}

export default function DocsPage() {
  return (
    <article className="mx-auto max-w-4xl space-y-8 px-6 py-20 md:py-24">
      <header className="max-w-2xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-primary">Docs</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Get started</h1>
        <p className="mt-4 text-muted-foreground">
          Connect any MCP client straight to one shared markdown memory through a single MCP
          endpoint - no CLI needed. Sign in with OAuth and your AI tools read and write the same
          notes.
        </p>
      </header>

      <Section title="Connect directly to memory.agentage.io" badge="Live">
        <p className="-mt-2 mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Any MCP client can connect straight to the endpoint - no CLI needed. Point it at{' '}
          <Endpoint /> and sign in with OAuth (no API key). Pick your client:
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <ClientCard title="Claude Code">
            <Terminal
              title="zsh"
              copy={CLAUDE_CODE_COMMAND}
              lines={[
                { t: CLAUDE_CODE_COMMAND, kind: 'cmd' },
                { t: 'Added HTTP MCP server: memory', kind: 'ok' },
              ]}
            />
            <p className="mt-3 text-sm text-muted-foreground">
              Then run <code className="rounded bg-muted px-1.5 py-0.5 text-[13px]">/mcp</code> and
              complete the OAuth sign-in.
            </p>
          </ClientCard>
          <ClientCard title="VS Code">
            <p className="mb-3 text-sm text-muted-foreground">
              Add the server to{' '}
              <code className="rounded bg-muted px-1.5 py-0.5 text-[13px]">.vscode/mcp.json</code>{' '}
              (or run the{' '}
              <code className="rounded bg-muted px-1.5 py-0.5 text-[13px]">MCP: Add Server</code>{' '}
              command):
            </p>
            <Terminal
              title=".vscode/mcp.json"
              copy={VSCODE_MCP_JSON}
              lines={VSCODE_MCP_JSON.split('\n').map((t) => ({ t }))}
            />
          </ClientCard>
          <ClientCard title="Claude (claude.ai & Desktop)">
            <Steps
              items={[
                {
                  title: 'Settings → Connectors → Add custom connector',
                  body: (
                    <>
                      Open{' '}
                      <a
                        href={CLAUDE_CONNECTORS_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline underline-offset-4 hover:text-primary/80"
                      >
                        claude.ai/customize/connectors
                      </a>{' '}
                      - also available in Claude Desktop.
                    </>
                  ),
                },
                {
                  title: 'Paste the endpoint',
                  body: <EndpointCopy />,
                },
              ]}
            />
          </ClientCard>
          <ClientCard title="ChatGPT">
            <Steps
              items={[
                {
                  title: 'Settings → Connectors → Add custom connector',
                  body: (
                    <>
                      Open{' '}
                      <a
                        href={CHATGPT_CONNECTORS_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline underline-offset-4 hover:text-primary/80"
                      >
                        ChatGPT Settings → Connectors
                      </a>{' '}
                      - paid plans; enable Developer mode under Advanced if the option is hidden.
                    </>
                  ),
                },
                {
                  title: 'Paste the endpoint',
                  body: <EndpointCopy />,
                },
              ]}
            />
          </ClientCard>
        </div>
      </Section>

      <Section title="MCP tools">
        <p className="-mt-2 mb-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Once connected, your tools get six memory operations:
        </p>
        <dl className="divide-y divide-border/60 overflow-hidden rounded-lg border border-border/60">
          {MCP_TOOLS.map(([name, desc]) => (
            <div key={name} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:gap-4">
              <dt className="font-mono text-[13px] text-primary sm:w-44 sm:shrink-0">{name}</dt>
              <dd className="text-sm text-muted-foreground">{desc}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Example prompts">
        <p className="-mt-2 mb-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Ask in plain language - Claude picks the right tools. A few to try once connected:
        </p>
        <ul className="space-y-4">
          {EXAMPLE_PROMPTS.map(({ prompt, outcome, tools }) => (
            <li
              key={prompt}
              className="rounded-xl border border-border/60 bg-background/40 p-4 md:p-5"
            >
              <p className="font-medium text-foreground">&ldquo;{prompt}&rdquo;</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{outcome}</p>
              <code className="mt-3 inline-block rounded bg-muted px-1.5 py-0.5 font-mono text-[12px] text-primary">
                {tools}
              </code>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Limitations">
        <ul className="max-w-2xl list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground marker:text-border">
          {LIMITATIONS.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </Section>

      <div className="pt-2">
        <Link
          href="/"
          className="text-sm text-primary underline underline-offset-4 hover:text-primary/80"
        >
          ← Back home
        </Link>
      </div>
    </article>
  );
}
