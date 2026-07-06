import { DocArticle } from './doc-article';
import { DocBreadcrumbs } from './doc-breadcrumbs';
import { DocPrevNext } from './doc-prev-next';
import { DocToc } from './doc-toc';
import type { DocPage } from '../types';

// Minimum sections before the right-rail outline earns its space.
const TOC_MIN_SECTIONS = 3;

// The article column plus the right-rail "On this page" outline. Breadcrumbs
// (sub-pages only) and prev/next wrap the client-rendered article; all four are
// build-time data, so the page stays static.
export function DocPageView({ doc }: { doc: DocPage }): React.JSX.Element {
  const isIndex = doc.slug === '';
  const showToc = doc.sections.length >= TOC_MIN_SECTIONS;

  return (
    <div className="flex gap-8">
      <div className="min-w-0 flex-1">
        {!isIndex && <DocBreadcrumbs slug={doc.slug} title={doc.title} />}
        <DocArticle doc={doc} />
        <DocPrevNext slug={doc.slug} />
      </div>
      {showToc && <DocToc sections={doc.sections} />}
    </div>
  );
}
