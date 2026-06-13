import {
  Plug,
  Share2,
  FileText,
  ShieldCheck,
  Search,
  Boxes,
  RefreshCw,
  Database,
  Lock,
} from 'lucide-react';
import { WaitlistForm } from './waitlist-form';

const problems = [
  {
    icon: Boxes,
    title: 'You run 4–5 AI tools a day',
    body: 'Claude, ChatGPT, Cursor, Claude Code. Each one opens with a blank slate and no idea what the others already know.',
  },
  {
    icon: RefreshCw,
    title: 'So you became the memory',
    body: 'Every switch, you re-paste the architecture, the decisions, the constraints. Fifteen to thirty minutes, several times a day, forever.',
  },
  {
    icon: Database,
    title: 'And vendor memory vanishes',
    body: 'Built-in memory gets deprecated or silently wiped. The context you spent weeks shaping disappears the next time a tool ships a breaking change.',
  },
];

const steps = [
  {
    icon: Plug,
    title: 'Connect once',
    body: 'Add Agentage Memory as an MCP connector in Claude, ChatGPT, Cursor, or Claude Code. One command or one click - no config, no plumbing.',
  },
  {
    icon: Share2,
    title: 'Every AI shares it',
    body: 'They all read and write the same memory. Make a decision in Claude; Cursor sees it the moment you switch. No more re-explaining.',
  },
  {
    icon: FileText,
    title: 'Files stay yours',
    body: 'Your memory mirrors to plain markdown on your machine. Open it in Obsidian, edit it by hand, export the whole thing anytime. You own it.',
  },
];

const features = [
  {
    icon: FileText,
    title: 'Files first',
    body: 'Plain markdown with YAML frontmatter - readable, editable, and yours to keep forever. Obsidian-native, not a black-box vector store.',
  },
  {
    icon: Share2,
    title: 'Every AI, one memory',
    body: 'Cross-vendor by default through MCP. Not a walled garden tied to one assistant - the same memory across every tool you use.',
  },
  {
    icon: Lock,
    title: 'Owned, not rented',
    body: 'Your own per-tenant store in the cloud plus a local mirror you control. Export anytime. Zero lock-in.',
  },
  {
    icon: ShieldCheck,
    title: 'Private by design',
    body: 'EU-resident by architecture, local-first, multi-region from day one. Your data stays in your region.',
  },
  {
    icon: Search,
    title: 'Fast search',
    body: 'Lexical search across your whole memory, so an AI can find why you chose SQLite - not just that you mentioned it.',
  },
  {
    icon: Plug,
    title: 'Pluggable',
    body: 'One endpoint, a growing set of tools. Memory is endpoint #1 of the Agentage MCP suite - more AI-native tools land over time.',
  },
];

const contrast = [
  {
    k: 'Closed memory DBs',
    v: 'Opaque vectors, someone else’s cloud, price cliffs. You can’t read your own memory.',
  },
  {
    k: 'Built-in AI memory',
    v: 'One assistant only. Deprecated or wiped when the vendor decides. Nothing crosses tools.',
  },
  {
    k: 'DIY files + scripts',
    v: 'Free, but you maintain the sync, the cron jobs, and the glue. No cross-vendor reach.',
  },
];

const heroLines = [
  { p: '$', t: 'npx @agentage/cli setup', cmd: true },
  { t: 'linking Claude        ✓' },
  { t: 'linking ChatGPT       ✓' },
  { t: 'linking Cursor        ✓' },
  { t: 'linking Claude Code   ✓' },
  { t: 'one memory, every AI - memory.agentage.io', ok: true },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="blueprint-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            One memory · every AI · owned by you
          </p>
          <h1 className="text-5xl font-bold leading-[1.08] tracking-tight md:text-7xl">
            One memory. <br />
            <span className="text-gradient-gold">For every AI</span>.
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            No plumbing. One connector links Claude, ChatGPT, Cursor, and Claude Code to a single
            markdown memory you own - mirrored to plain files on your machine.
          </p>

          {/* terminal */}
          <div className="mx-auto mt-12 max-w-xl overflow-hidden rounded-xl border border-border bg-[#0b0b0e] text-left shadow-2xl shadow-black/40">
            <div className="flex items-center gap-1.5 border-b border-border/60 px-4 py-2.5">
              <span className="size-2.5 rounded-full bg-destructive/70" />
              <span className="size-2.5 rounded-full bg-warning/70" />
              <span className="size-2.5 rounded-full bg-success/70" />
              <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                zsh - agentage
              </span>
            </div>
            <pre className="px-4 py-4 font-mono text-[13px] leading-relaxed">
              {heroLines.map((l, i) => (
                <div key={i}>
                  {l.cmd && <span className="text-primary">{l.p} </span>}
                  {!l.cmd && !l.ok && <span className="text-muted-foreground">{'↳ '}</span>}
                  <span
                    className={
                      l.ok ? 'text-success' : l.cmd ? 'text-foreground' : 'text-muted-foreground'
                    }
                  >
                    {l.t}
                  </span>
                </div>
              ))}
              <span
                className="hero-anim inline-block h-4 w-2 translate-y-0.5 bg-primary"
                style={{ animation: 'blink 1.1s step-end infinite' }}
              />
            </pre>
          </div>

          <div className="mt-12">
            <WaitlistForm id="waitlist" autoFocus location="hero" />
          </div>
        </div>
      </section>

      <div className="divider-gradient" />

      {/* ── Problem ── */}
      <section className="bg-sidebar py-20">
        <div className="mx-auto max-w-5xl px-6">
          <p className="mb-3 text-center font-mono text-xs uppercase tracking-widest text-primary">
            The problem
          </p>
          <h2 className="mb-4 text-center text-2xl font-bold md:text-4xl">
            Right now, you are the memory layer
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-muted-foreground">
            Multi-tool AI work has a hidden tax: the context that lives in your head, copy-pasted
            between tools all day long.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {problems.map((p) => (
              <div
                key={p.title}
                className="flex flex-col gap-3 rounded-xl border border-border/40 p-6"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                  <p.icon className="size-5 text-primary" />
                </div>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider-gradient" />

      {/* ── How it works ── */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <p className="mb-3 text-center font-mono text-xs uppercase tracking-widest text-primary">
            How it works
          </p>
          <h2 className="mb-4 text-center text-2xl font-bold md:text-4xl">
            Shared everywhere, automatically.
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-muted-foreground">
            No new app to live in. Your AIs just stop forgetting.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className="group flex flex-col gap-4 rounded-xl border border-border/40 p-6 transition-all duration-300 hover:border-border hover:bg-card/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                    <s.icon className="size-5 text-primary" />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider-gradient" />

      {/* ── Why it wins ── */}
      <section className="bg-sidebar py-20">
        <div className="mx-auto max-w-5xl px-6">
          <p className="mb-3 text-center font-mono text-xs uppercase tracking-widest text-primary">
            Why Agentage Memory
          </p>
          <h2 className="mb-4 text-center text-2xl font-bold md:text-4xl">
            The memory layer the way it should be
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-muted-foreground">
            Open, portable, and private - the antithesis of a closed cloud database.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group flex flex-col gap-3 rounded-xl border border-border/40 p-6 transition-all duration-300 hover:border-border hover:bg-card/50"
              >
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                  <f.icon className="size-[18px] text-primary" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider-gradient" />

      {/* ── Differentiation ── */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">
            How we compare
          </p>
          <h2 className="mb-12 text-2xl font-bold md:text-4xl">
            Not a closed database. Not locked to one vendor. Not a script you babysit.
          </h2>
          <div className="grid gap-4 text-left sm:grid-cols-3">
            {contrast.map((c) => (
              <div key={c.k} className="rounded-xl border border-border/40 p-5">
                <div className="mb-2 text-sm font-semibold text-muted-foreground">{c.k}</div>
                <p className="text-sm leading-relaxed text-muted-foreground/80">{c.v}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-6">
            <div className="mb-2 text-sm font-semibold text-primary">Agentage Memory</div>
            <p className="text-sm leading-relaxed text-foreground">
              Open markdown files you own + cross-vendor sync + EU-hosted + managed for you. Your
              memory survives your tool’s next breaking change.
            </p>
          </div>
        </div>
      </section>

      <div className="divider-gradient" />

      {/* ── Final CTA ── */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            Be first to <span className="text-gradient-gold">own your AI’s memory</span>.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            Join the waitlist. We’ll reach out as connectors open up, starting with the tools you
            tell us you use.
          </p>
          <div className="mt-10">
            <WaitlistForm location="footer" />
          </div>
        </div>
      </section>
    </>
  );
}
