import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  ImgHTMLAttributes,
  TableHTMLAttributes,
} from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { BlogPre } from './blog-pre';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode, { type Options as PrettyCodeOptions } from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

const prettyCodeOptions: PrettyCodeOptions = {
  theme: 'github-dark-dimmed',
  keepBackground: false,
  defaultLang: 'plaintext',
};

const autolinkOptions = {
  behavior: 'prepend' as const,
  properties: { className: ['heading-anchor'], 'aria-label': 'Link to this section' },
  content: { type: 'text' as const, value: '#' },
};

const components = {
  // A markdown link to an app deep link (e.g. obsidian://...) renders as a
  // prominent install button; everything else stays a normal prose link.
  a: ({ href = '', children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (href.startsWith('obsidian://')) {
      return (
        // Inline color/decoration beat the higher-specificity .prose-blog a rule
        // (amber text + underline) so the button stays dark-on-amber, no underline.
        <a
          {...props}
          href={href}
          style={{ color: '#0b0b0d', textDecoration: 'none' }}
          className="my-3 inline-flex items-center gap-2 rounded-lg bg-[#f59e0b] px-5 py-3 text-[15px] font-semibold shadow-sm transition-opacity hover:opacity-90"
        >
          {children}
        </a>
      );
    }
    return (
      <a {...props} href={href}>
        {children}
      </a>
    );
  },
  img: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={props.alt ?? ''}
      loading="lazy"
      className="my-8 w-full rounded-xl border border-border bg-card"
    />
  ),
  table: (props: TableHTMLAttributes<HTMLTableElement>) => (
    <div className="table-wrap">
      <table {...props} />
    </div>
  ),
  pre: (props: HTMLAttributes<HTMLPreElement>) => <BlogPre {...props} />,
};

export function BlogMdx({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, autolinkOptions],
            [rehypePrettyCode, prettyCodeOptions],
          ],
        },
      }}
    />
  );
}
