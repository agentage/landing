import { DocNav } from '@/docs/components/doc-nav';

// Docs shell: adds the left sidebar inside the site chrome. The root layout
// already provides the header, footer, and <main>, so this only lays out the
// sidebar + content at the site width (max-w-5xl), matching the rest of the site.
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-5xl gap-8 px-6">
      <DocNav />
      <div className="min-w-0 flex-1 py-10">{children}</div>
    </div>
  );
}
