import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DocPageView } from '@/docs/components/doc-page-view';
import { getDoc } from '@/docs/registry';

const doc = getDoc('');

export const metadata: Metadata = {
  title: 'Docs - Agentage Memory',
  description: doc?.lede,
  alternates: { canonical: '/docs' },
  openGraph: { url: '/docs' },
};

export default function DocsIndexPage() {
  if (!doc) notFound();
  return <DocPageView doc={doc} />;
}
