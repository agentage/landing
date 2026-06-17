'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { trackEvent } from './analytics';
import { API_URL } from '../lib/site';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SUCCESS = "You're subscribed - product news and new connectors, no spam.";
const INVALID = 'Enter a valid email address.';
const RETRY = 'Something went wrong. Please try again.';

type Status = 'idle' | 'pending' | 'success' | 'error';

function compact<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v != null)) as Partial<T>;
}

function context() {
  const utm = compact(
    Object.fromEntries(
      ['source', 'medium', 'campaign', 'term', 'content'].map((k) => [
        k,
        new URLSearchParams(window.location.search).get(`utm_${k}`) ?? undefined,
      ])
    )
  );
  return compact({
    referrer: document.referrer || undefined,
    page: window.location.href,
    locale: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    utm: Object.keys(utm).length ? utm : undefined,
  });
}

export function NewsletterForm({
  id,
  autoFocus = false,
  location = 'hero',
}: {
  id?: string;
  autoFocus?: boolean;
  location?: string;
}) {
  const emailRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const input = emailRef.current;
    if (!input) return;
    // Plain autoFocus (initial load) must not scroll.
    if (!(id && window.location.hash === `#${id}`)) {
      if (autoFocus) input.focus({ preventScroll: true });
      return;
    }
    // Arrived via the anchor (e.g. from a blog cover). Defer past the browser's
    // native fragment scroll, then center and focus. 'instant' because the page
    // sets scroll-behavior: smooth, under which a programmatic 'smooth'
    // scrollIntoView silently no-ops in Chrome.
    const t = setTimeout(() => {
      input.scrollIntoView({ behavior: 'instant', block: 'center' });
      input.focus({ preventScroll: true });
    }, 150);
    return () => clearTimeout(t);
  }, [id, autoFocus]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get('email') ?? '')
      .trim()
      .toLowerCase();
    if (!EMAIL_RE.test(email)) {
      setStatus('error');
      setMessage(INVALID);
      return;
    }

    setStatus('pending');
    try {
      // Hits the email-list endpoint on the API host (api.<fqdn>/api, cross-origin;
      // backend CORS trusts the apex). Reuses /waitlist - the product launched, so this
      // list is now product news + new-connector updates rather than a launch waitlist.
      const res = await fetch(`${API_URL}/waitlist`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, list: 'news', ...context() }),
      });
      if (res.ok) {
        setStatus('success');
        setMessage(SUCCESS);
        trackEvent('news_signup', { location });
      } else {
        setStatus('error');
        setMessage(res.status === 400 ? INVALID : RETRY);
      }
    } catch {
      setStatus('error');
      setMessage(RETRY);
    }
  }

  if (status === 'success') {
    return (
      <div
        id={id}
        className="mx-auto flex max-w-md flex-col items-center gap-2 rounded-xl border border-success/30 bg-success/5 px-6 py-8 text-center"
      >
        <div className="text-2xl">✓</div>
        <p className="text-sm text-foreground">{message}</p>
      </div>
    );
  }

  return (
    <form id={id} onSubmit={onSubmit} className="mx-auto flex max-w-md flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          ref={emailRef}
          type="email"
          name="email"
          required
          placeholder="you@work.com"
          autoComplete="email"
          className="h-12 rounded-lg border border-border bg-background px-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/40 sm:h-11 sm:flex-1 sm:text-sm"
        />
        <button
          type="submit"
          disabled={status === 'pending'}
          className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:opacity-60 sm:h-11"
        >
          {status === 'pending' ? 'Subscribing…' : 'Get news'}
        </button>
      </div>
      {status === 'error' && <p className="text-center text-xs text-destructive">{message}</p>}
      <p className="text-center text-[11px] text-muted-foreground">
        EU-hosted · no spam · unsubscribe anytime.
      </p>
    </form>
  );
}
