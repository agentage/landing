import type { HTMLAttributes, ImgHTMLAttributes, TableHTMLAttributes } from 'react';
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
