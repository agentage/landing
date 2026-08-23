'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronRight,
  Plug,
  Terminal,
  MessageSquare,
  Code,
  MousePointerClick,
  Bot,
  Sparkles,
  Wrench,
  BookOpen,
  Globe,
  Lightbulb,
  Library,
  LifeBuoy,
  Server,
  Puzzle,
  Search,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@agentage/design-system/utils';
import { docsNav } from '../nav';
import type { DocNavGroup, DocNavItem } from '../types';

// Per-item icon, keyed by label. Lives here (not in nav data) so the data stays
// plain + serializable.
const ICONS: Record<string, LucideIcon> = {
  Overview: BookOpen,
  'MCP server': Plug,
  'Connect a client': Plug,
  'Claude Code': Terminal,
  Claude: MessageSquare,
  'VS Code': Code,
  Cursor: MousePointerClick,
  ChatGPT: Bot,
  Grok: Sparkles,
  'Prompt examples': Lightbulb,
  'MCP tools': Wrench,
  'REST API': Globe,
  'Catalog MCP': Library,
  'Catalog API': Library,
  CLI: Terminal,
  'Local API': Server,
  'Obsidian plugin': Puzzle,
  'VS Code extension': Code,
  Troubleshoot: LifeBuoy,
};

const hrefFor = (slug: string): string => (slug === '' ? '/docs' : `/docs/${slug}`);

const groupKey = (title: string): string => `group:${title}`;
const itemKey = (parentKey: string, label: string): string => `${parentKey}/${label}`;

// Keep an item when its own label matches; otherwise keep it only for the
// nested children that do.
function filterItems(items: DocNavItem[], query: string): DocNavItem[] {
  return items.flatMap((item) => {
    if (item.label.toLowerCase().includes(query)) return [item];
    const nested = item.items ? filterItems(item.items, query) : [];
    return nested.length > 0 ? [{ ...item, items: nested }] : [];
  });
}

// Collect the keys of every item whose own page or subtree is the active route.
function collectActiveKeys(
  items: DocNavItem[],
  pathname: string,
  parentKey: string,
  out: Set<string>
): boolean {
  let any = false;
  for (const item of items) {
    const key = itemKey(parentKey, item.label);
    const self = item.slug !== undefined && hrefFor(item.slug) === pathname;
    const child = item.items ? collectActiveKeys(item.items, pathname, key, out) : false;
    if (self || child) {
      out.add(key);
      any = true;
    }
  }
  return any;
}

/** Keys of the groups and nested parents that hold the active route. */
export function activeNavKeys(groups: DocNavGroup[], pathname: string): Set<string> {
  const out = new Set<string>();
  for (const group of groups) {
    const key = groupKey(group.title);
    if (collectActiveKeys(group.items, pathname, key, out)) out.add(key);
  }
  return out;
}

function CollapseToggle({
  open,
  label,
  controls,
  onToggle,
  className,
}: {
  open: boolean;
  label: string;
  controls: string;
  onToggle: () => void;
  className?: string;
}): React.JSX.Element {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={controls}
      aria-label={`${open ? 'Collapse' : 'Expand'} ${label}`}
      onClick={onToggle}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        className
      )}
    >
      <ChevronRight
        aria-hidden
        className={cn('size-3.5 transition-transform duration-150', open && 'rotate-90')}
      />
    </button>
  );
}

interface CollapseProps {
  /** True while the search filter is on - hidden matches must show. */
  filtering: boolean;
  isOpen: (key: string, defaultOpen: boolean) => boolean;
  onToggle: (key: string, next: boolean) => void;
}

function NavItem({
  item,
  pathname,
  parentKey,
  filtering,
  isOpen,
  onToggle,
}: { item: DocNavItem; pathname: string; parentKey: string } & CollapseProps): React.JSX.Element {
  const Icon = ICONS[item.label] ?? BookOpen;
  const href = item.slug === undefined ? undefined : hrefFor(item.slug);
  const active = href !== undefined && pathname === href;
  const children = item.items ?? [];
  const key = itemKey(parentKey, item.label);
  const listId = useId();
  const open = filtering || isOpen(key, item.defaultCollapsed !== true);

  return (
    <li>
      <div className="relative">
        {item.comingSoon || href === undefined ? (
          <span className="flex cursor-default items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-foreground/40">
            <Icon className="size-4 shrink-0" />
            <span className="flex-1 truncate">{item.label}</span>
            <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
              soon
            </span>
          </span>
        ) : (
          <Link
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'group relative flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors',
              children.length > 0 && 'pr-7',
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
                active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
              )}
            />
            <span className="flex-1 truncate">{item.label}</span>
          </Link>
        )}
        {children.length > 0 && (
          <CollapseToggle
            open={open}
            label={item.label}
            controls={listId}
            onToggle={() => onToggle(key, !open)}
            className="absolute right-1 top-1/2 z-10 -translate-y-1/2"
          />
        )}
      </div>
      {children.length > 0 && (
        <ul
          id={listId}
          className={cn('ml-4 mt-0.5 space-y-0.5 border-l border-border pl-1.5', !open && 'hidden')}
        >
          {children.map((child) => (
            <NavItem
              key={child.label}
              item={child}
              pathname={pathname}
              parentKey={key}
              filtering={filtering}
              isOpen={isOpen}
              onToggle={onToggle}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function NavGroup({
  group,
  pathname,
  filtering,
  isOpen,
  onToggle,
}: { group: DocNavGroup; pathname: string } & CollapseProps): React.JSX.Element {
  const key = groupKey(group.title);
  const listId = useId();
  const open = filtering || isOpen(key, group.defaultCollapsed !== true);

  return (
    <div className="mb-5 last:mb-0">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => onToggle(key, !open)}
        className="mb-1.5 flex w-full cursor-pointer items-center gap-2 rounded-md px-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <span className="flex-1 truncate">{group.title}</span>
        <ChevronRight
          aria-hidden
          className={cn('size-3.5 shrink-0 transition-transform duration-150', open && 'rotate-90')}
        />
      </button>
      <ul id={listId} className={cn('space-y-0.5', !open && 'hidden')}>
        {group.items.map((item) => (
          <NavItem
            key={item.label}
            item={item}
            pathname={pathname}
            parentKey={key}
            filtering={filtering}
            isOpen={isOpen}
            onToggle={onToggle}
          />
        ))}
      </ul>
    </div>
  );
}

export function DocNav(): React.JSX.Element {
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [openKeys, setOpenKeys] = useState<Record<string, boolean>>({});

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return docsNav;
    return docsNav
      .map((g) => ({ ...g, items: filterItems(g.items, q) }))
      .filter((g) => g.items.length > 0);
  }, [query]);

  const activeKeys = useMemo(() => activeNavKeys(docsNav, pathname), [pathname]);

  // Pin the active route's ancestors open so they stay open after navigating away.
  useEffect(() => {
    setOpenKeys((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const key of activeKeys) {
        if (next[key] !== true) {
          next[key] = true;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [activeKeys]);

  const isOpen = (key: string, defaultOpen: boolean): boolean =>
    openKeys[key] ?? (defaultOpen || activeKeys.has(key));

  const onToggle = (key: string, next: boolean): void =>
    setOpenKeys((prev) => ({ ...prev, [key]: next }));

  const filtering = query.trim().length > 0;

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
            <NavGroup
              key={group.title}
              group={group}
              pathname={pathname}
              filtering={filtering}
              isOpen={isOpen}
              onToggle={onToggle}
            />
          ))}
          {groups.length === 0 && (
            <p className="px-2 py-4 text-sm text-muted-foreground">No matches.</p>
          )}
        </nav>
      </div>
    </aside>
  );
}
