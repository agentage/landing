import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { SITE_URL } from '@/lib/site';
import { docsNav } from '../nav';
import { docHref, navEntryFor } from '../nav-order';

// "Docs / <group> / <page>" trail above the h1 on a doc sub-page, plus a
// BreadcrumbList for rich results. The group is a nav heading (no page of its
// own), so it appears in the visible trail but carries no `item` URL.
export function DocBreadcrumbs({
  slug,
  title,
}: {
  slug: string;
  title: string;
}): React.JSX.Element {
  const group = navEntryFor(slug, docsNav)?.groupTitle;
  const items: { name: string; href?: string }[] = [
    { name: 'Docs', href: '/docs' },
    ...(group ? [{ name: group }] : []),
    { name: title, href: docHref(slug) },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <li>
          <Link href="/docs" className="transition-colors hover:text-foreground">
            Docs
          </Link>
        </li>
        {group && (
          <>
            <ChevronRight className="size-3 shrink-0" aria-hidden />
            <li>{group}</li>
          </>
        )}
        <ChevronRight className="size-3 shrink-0" aria-hidden />
        <li className="font-medium text-foreground" aria-current="page">
          {title}
        </li>
      </ol>
    </nav>
  );
}
