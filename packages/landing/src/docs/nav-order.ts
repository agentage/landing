import type { DocNavGroup } from './types';

// Pure derivation of reading order + breadcrumb data from the sidebar nav, so
// prev/next and breadcrumbs stay in sync with the one nav source of truth.
// Kept free of the docsNav import (and its `@/` content chain) so it unit-tests
// in isolation; callers pass the groups.

export interface FlatNavEntry {
  label: string;
  slug: string;
  groupTitle: string;
}

export interface PrevNext {
  prev?: FlatNavEntry;
  next?: FlatNavEntry;
}

// URL for a doc slug ('' is the docs index).
export const docHref = (slug: string): string => (slug === '' ? '/docs' : `/docs/${slug}`);

// URL for a doc slug's markdown mirror ('' is /docs.md; others /docs/<slug>.md).
export const docMdHref = (slug: string): string => (slug === '' ? '/docs.md' : `/docs/${slug}.md`);

// Flatten sidebar groups into reading order, dropping stubs (comingSoon or
// slug-less) so navigation only ever points at real, live pages.
export function flattenNav(groups: DocNavGroup[]): FlatNavEntry[] {
  const out: FlatNavEntry[] = [];
  for (const group of groups) {
    for (const item of group.items) {
      if (item.comingSoon || item.slug === undefined) continue;
      out.push({ label: item.label, slug: item.slug, groupTitle: group.title });
    }
  }
  return out;
}

// Previous/next entries around a page in the flattened order.
export function prevNext(slug: string, groups: DocNavGroup[]): PrevNext {
  const flat = flattenNav(groups);
  const idx = flat.findIndex((e) => e.slug === slug);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? flat[idx - 1] : undefined,
    next: idx < flat.length - 1 ? flat[idx + 1] : undefined,
  };
}

// The flattened entry for a page (carries its group title, for breadcrumbs).
export function navEntryFor(slug: string, groups: DocNavGroup[]): FlatNavEntry | undefined {
  return flattenNav(groups).find((e) => e.slug === slug);
}
