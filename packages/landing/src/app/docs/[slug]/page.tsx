import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DocPageView } from '@/docs/components/doc-page-view';
import { docSlugs, getDoc } from '@/docs/registry';
import { docMetadata } from '@/docs/seo';

export function generateStaticParams(): { slug: string }[] {
  return docSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) return {};
  return docMetadata(doc);
}

export default async function DocSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.JSX.Element> {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();
  return <DocPageView doc={doc} />;
}
