import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DocPageView } from '@/docs/components/doc-page-view';
import { getDoc } from '@/docs/registry';
import { docMetadata } from '@/docs/seo';

const doc = getDoc('');

export const metadata: Metadata = doc ? docMetadata(doc) : {};

export default function DocsIndexPage() {
  if (!doc) notFound();
  return <DocPageView doc={doc} />;
}
