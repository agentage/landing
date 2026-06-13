'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

type Status = 'idle' | 'working' | 'done' | 'error';

// Removal happens on an explicit click (POST), never on page load - so email
// scanners that prefetch the link can't unsubscribe people by accident.
export function UnsubscribeForm() {
  const params = useSearchParams();
  const email = params.get('email') ?? '';
  const token = params.get('token') ?? '';
  const [status, setStatus] = useState<Status>('idle');

  if (!email || !token) {
    return (
      <p className="text-sm text-muted-foreground">
        This unsubscribe link is missing or invalid. Use the link from your most recent email.
      </p>
    );
  }

  async function unsubscribe() {
    setStatus('working');
    try {
      const res = await fetch(
        `/api/waitlist/unsubscribe?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`,
        { method: 'POST' }
      );
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="text-2xl">✓</div>
        <p className="text-sm text-foreground">
          You&rsquo;ve been removed from the AgentAge Memory waitlist. You won&rsquo;t hear from us
          again.
        </p>
        <a href="/" className="text-sm text-primary underline underline-offset-4">
          Changed your mind? Join again
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p className="text-sm text-muted-foreground">
        Unsubscribe <span className="text-foreground">{email}</span> and remove it from the AgentAge
        Memory waitlist?
      </p>
      <button
        type="button"
        onClick={unsubscribe}
        disabled={status === 'working'}
        className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
      >
        {status === 'working' ? 'Removing…' : 'Unsubscribe'}
      </button>
      {status === 'error' && (
        <p className="text-xs text-destructive">
          Something went wrong. Try the link from your latest email, or contact vreshch@gmail.com.
        </p>
      )}
    </div>
  );
}
