'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Plug,
  Terminal,
  MessageSquare,
  Code,
  MousePointerClick,
  Bot,
  Wrench,
  BookOpen,
  Search,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { docsNav } from '../nav';

// Per-item icon, keyed by label. Lives here (not in nav data) so the data stays
// plain + serializable.
const ICONS: Record<string, LucideIcon> = {
  Overview: BookOpen,
  'MCP server': Plug,
  'Any client': Plug,
  'Claude Code': Terminal,
  Claude: MessageSquare,
  'VS Code': Code,
  Cursor: MousePointerClick,
  ChatGPT: Bot,
  CLI: Terminal,
  'MCP tools': Wrench,
};

const hrefFor = (slug: string): string => (slug === '' ? '/docs' : `/docs/${slug}`);

export function DocNav(): React.JSX.Element {
  const pathname = usePathname();
  const [query, setQuery] = useState('');

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return docsNav;
    return docsNav
      .map((g) => ({ ...g, items: g.items.filter((i) => i.label.toLowerCase().includes(q)) }))
      .filter((g) => g.items.length > 0);
  }, [query]);

  return (
    <aside className="sticky top-[69px] hidden h-[calc(100vh-69px)] w-52 shrink-0 border-r border-border md:block">
      <div className="flex h-full flex-col">
        <div className="border-b border-border p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search docs"
              aria-label="Search docs"
              className="w-full rounded-md border border-border bg-card py-1.5 pl-8 pr-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3" aria-label="Docs">
          {groups.map((group) => (
            <div key={group.title} className="mb-5 last:mb-0">
              <div className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.title}
              </div>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = ICONS[item.label] ?? BookOpen;
                  if (item.comingSoon || item.slug === undefined) {
                    return (
                      <li key={item.label}>
                        <span className="flex cursor-default items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-foreground/40">
                          <Icon className="size-4 shrink-0" />
                          <span className="flex-1 truncate">{item.label}</span>
                          <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
                            soon
                          </span>
                        </span>
                      </li>
                    );
                  }
                  const href = hrefFor(item.slug);
                  const active = pathname === href;
                  return (
                    <li key={item.label}>
                      <Link
                        href={href}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'group relative flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors',
                          active
                            ? 'bg-primary/10 font-medium text-primary'
                            : 'text-foreground/70 hover:bg-accent hover:text-foreground'
                        )}
                      >
                        <span
                          className={cn(
                            'absolute inset-y-1 left-0 w-0.5 rounded-full bg-primary transition-opacity',
                            active ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <Icon
                          className={cn(
                            'size-4 shrink-0',
                            active
                              ? 'text-primary'
                              : 'text-muted-foreground group-hover:text-foreground'
                          )}
                        />
                        <span className="flex-1 truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          {groups.length === 0 && (
            <p className="px-2 py-4 text-sm text-muted-foreground">No matches.</p>
          )}
        </nav>
      </div>
    </aside>
  );
}
