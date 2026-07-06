'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Heart, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SESSION_API,
  SIGN_OUT_API,
  catalogFavoritesUrl,
  signInHref,
  type SessionResponse,
  type SessionUser,
} from '@/lib/session';

// Client-only account slot. Fetches the BFF session on mount so the SSR HTML stays
// anonymous (no per-user content in view-source) and marketing pages stay static; a
// transient 503/network error keeps the neutral slot rather than flashing signed-out.
type State = { status: 'loading' } | { status: 'ready'; data: SessionResponse };

// Avatar initials: up to two letters from the name, else the email local-part.
function initials(user: SessionUser): string {
  const source = (user.name ?? user.email).trim();
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  const letters = parts.slice(0, 2).map((p) => p[0]);
  return (letters.join('') || source[0] || '?').toUpperCase();
}

export function AccountMenu({ className }: { className?: string }) {
  const [state, setState] = useState<State>({ status: 'loading' });
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(SESSION_API, {
        headers: { accept: 'application/json' },
        cache: 'no-store',
      });
      // 503/non-ok = transient: keep the loading slot, never flash signed-out.
      if (!res.ok) return;
      setState({ status: 'ready', data: (await res.json()) as SessionResponse });
    } catch {
      // Blip: leave the slot; the next navigation re-fetches.
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const signOut = useCallback(async () => {
    setSigningOut(true);
    try {
      await fetch(SIGN_OUT_API, { method: 'POST', headers: { accept: 'application/json' } });
    } catch {
      // Ignore - the reload reflects the true state either way.
    }
    window.location.reload();
  }, []);

  // Fixed-width neutral slot while loading/transient: no layout shift, no flash.
  if (state.status === 'loading') return <div className={cn('h-9 w-9', className)} aria-hidden />;

  const { user, signInUrl } = state.data;

  if (!user) {
    return (
      <a
        href={signInHref(signInUrl)}
        className={cn(
          'rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground',
          className
        )}
      >
        Sign in
      </a>
    );
  }

  const favoritesUrl =
    typeof window === 'undefined' ? '#' : catalogFavoritesUrl(window.location.hostname);

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary transition-colors duration-200 hover:bg-primary/25"
      >
        {initials(user)}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-xl border border-border bg-background shadow-lg"
        >
          <div
            className="truncate border-b border-border px-4 py-3 text-sm text-muted-foreground"
            title={user.email}
          >
            {user.email}
          </div>
          <a
            role="menuitem"
            href={favoritesUrl}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground transition-colors duration-200 hover:bg-muted"
          >
            <Heart className="h-4 w-4" />
            Favorites
          </a>
          <button
            role="menuitem"
            type="button"
            onClick={signOut}
            disabled={signingOut}
            className={cn(
              'flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-foreground transition-colors duration-200 hover:bg-muted',
              signingOut && 'opacity-50'
            )}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
