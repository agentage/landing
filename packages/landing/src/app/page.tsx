import Link from 'next/link';
import { ConnectBlock } from './connect-block';
import { NewsletterForm } from './newsletter-form';
import { problems, steps, features, contrast } from './home-content';

export default function HomePage() {
  return (
    <>
      {/* ── Hero (benefit-led, two-column split) ── */}
      <section className="relative overflow-hidden pb-20 md:pb-28">
        <div className="blueprint-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-5xl items-center gap-12 px-6 md:grid-cols-2">
          {/* Left: the pitch */}
          <div className="min-w-0 text-center md:text-left">
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              One memory. Every AI. Owned by you.
            </p>
            <h1 className="text-5xl font-bold leading-[1.08] tracking-tight md:text-6xl">
              Your memory, <br />
              <span className="text-gradient-gold">in every AI</span>.
            </h1>
            <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-muted-foreground md:mx-0">
              One markdown memory you own, shared across Claude, ChatGPT, Cursor, and Claude Code.
              Paste one URL - signing in creates your account. EU-hosted, export anytime.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:items-start">
              <Link
                href="/#connect"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-7 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
              >
                Connect your AI
              </Link>
              <Link
                href="/docs"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-6 text-sm font-medium text-foreground transition-colors hover:bg-card/50"
              >
                See the docs
              </Link>
            </div>
          </div>

          {/* Right: connect (setup = sign-up) */}
          <div id="connect" className="min-w-0 scroll-mt-24">
            <ConnectBlock />
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
            Own <span className="text-gradient-gold">your AI’s memory</span>.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            One endpoint. Every AI. Sign in once and your memory follows you across every tool.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3">
            <Link
              href="/#connect"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
            >
              Connect your AI
            </Link>
            <Link
              href="/docs"
              className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
            >
              or see the full setup docs →
            </Link>
          </div>

          {/* Demoted email path: product news, not a launch waitlist. */}
          <div className="mx-auto mt-16 max-w-md border-t border-border/40 pt-10">
            <p className="mb-5 text-sm text-muted-foreground">
              Not ready to connect? Get product news and new-connector drops.
            </p>
            <NewsletterForm id="waitlist" location="footer" />
          </div>
        </div>
      </section>
    </>
  );
}
