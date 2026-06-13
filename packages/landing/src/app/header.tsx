'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { GITHUB_URL } from '../lib/site';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Docs', href: '/docs' },
  { label: 'Blog', href: '/blog' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'GitHub', href: GITHUB_URL },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-border bg-background/80 shadow-sm backdrop-blur-xl'
          : 'bg-background'
      )}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-lg font-bold tracking-tight transition-colors duration-200">
          <span className="text-foreground">Agent</span>
          <span className="text-primary">♥</span>
          <span className="text-foreground">Age</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label }) => {
            const isActive =
              href === '/'
                ? pathname === '/'
                : pathname === href || pathname.startsWith(`${href}/`);
            const isExternal = href.startsWith('http');

            return isExternal ? (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                {label}
              </a>
            ) : (
              <Link
                key={href}
                href={href}
                className={cn(
                  'group relative px-3 py-2 text-sm font-medium transition-colors duration-200',
                  isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {label}
                <span
                  className={cn(
                    'absolute inset-x-3 -bottom-[1px] h-[2px] rounded-lg transition-all duration-300',
                    isActive ? 'bg-primary' : 'scale-x-0 bg-primary/60 group-hover:scale-x-100'
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="relative rounded-lg p-2 text-muted-foreground transition-colors duration-200 hover:text-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <div className="relative h-5 w-5">
            <span
              className={cn(
                'absolute left-0 block h-[2px] w-5 rounded-lg bg-current transition-all duration-300',
                mobileOpen ? 'top-[9px] rotate-45' : 'top-[3px] rotate-0'
              )}
            />
            <span
              className={cn(
                'absolute left-0 top-[9px] block h-[2px] w-5 rounded-lg bg-current transition-all duration-200',
                mobileOpen ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100'
              )}
            />
            <span
              className={cn(
                'absolute left-0 block h-[2px] w-5 rounded-lg bg-current transition-all duration-300',
                mobileOpen ? 'top-[9px] -rotate-45' : 'top-[15px] rotate-0'
              )}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out md:hidden',
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <nav className="px-6 pb-4 pt-2">
          {navLinks.map(({ href, label }) => {
            const isActive =
              href === '/'
                ? pathname === '/'
                : pathname === href || pathname.startsWith(`${href}/`);
            const isExternal = href.startsWith('http');
            const cls = cn(
              'block rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200',
              isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            );
            return isExternal ? (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer" className={cls}>
                {label}
              </a>
            ) : (
              <Link key={href} href={href} className={cls} onClick={() => setMobileOpen(false)}>
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
