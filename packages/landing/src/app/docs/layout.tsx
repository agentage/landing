import { DocNav } from '@/docs/components/doc-nav';

// Docs shell: adds the left sidebar inside the site chrome. The root layout
// already provides the header, footer, and <main>. Widened to max-w-7xl so the
// right-rail "On this page" TOC fits at xl without squeezing the article column.
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-7xl gap-8 px-6">
      <DocNav />
      <div className="min-w-0 flex-1 pb-16">{children}</div>
    </div>
  );
}
