import type { Metadata } from 'next';
import { SITE_NAME } from '../lib/site';
import type { DocPage } from './types';

// Keywords shared by every docs page; per-page `keywords` are merged on top.
const BASE_KEYWORDS = [
  'Agentage Memory',
  'MCP',
  'Model Context Protocol',
  'shared memory',
  'AI memory',
  'markdown memory',
  'memory.agentage.io',
];

export const docPath = (doc: DocPage): string => (doc.slug === '' ? '/docs' : `/docs/${doc.slug}`);

// Full, crawl-ready metadata for a docs page: title, description, merged
// keywords, self-canonical, and OpenGraph (the file-based OG image still
// applies). Used by both the index route and the [slug] route.
export function docMetadata(doc: DocPage): Metadata {
  const path = docPath(doc);
  // Bare page title; the root layout template appends " - Agentage Memory".
  // A "docs" distinction is preserved for content pages.
  const title = doc.slug === '' ? 'Docs' : `${doc.title} - docs`;
  const keywords = [...new Set([...BASE_KEYWORDS, ...(doc.keywords ?? [])])];
  return {
    title,
    description: doc.lede,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      title,
      description: doc.lede,
      url: path,
      type: 'article',
      siteName: SITE_NAME,
      locale: 'en_US',
      images: ['/opengraph-image'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: doc.lede,
      images: ['/twitter-image'],
    },
  };
}
