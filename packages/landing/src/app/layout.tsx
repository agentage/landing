import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from './header';
import { Footer } from './footer';
import { Analytics } from './analytics';
import { GITHUB_URL, SITE_NAME, SITE_TAGLINE, SITE_URL } from '../lib/site';

// SEO title/description front-load the winnable wedge (files-first markdown +
// named tools); the brand tagline (SITE_TAGLINE) is kept for the social card only.
const TITLE = 'Shared markdown memory for Claude, ChatGPT & Cursor | Agentage';
const DESCRIPTION =
  'Shared markdown memory for Claude, ChatGPT, Cursor & every AI - one MCP endpoint, files-first, EU-private, export anytime. Owned by you.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
  icons: {
    // No SVG <link>: Google's favicon scraper (used for the Claude connector icon)
    // mis-rasterizes favicon.svg to a near-black tile. An explicit PNG + the .ico
    // (a solid brand-gold tile) make scrapers pick a correct icon.
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: SITE_TAGLINE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TAGLINE,
    description: DESCRIPTION,
    site: '@agentage',
    creator: '@vreshch',
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  // GA id carrier for <Analytics /> - baked as a sentinel, substituted from
  // GA_MEASUREMENT_ID at container start (see docker/runtime-env.sh). Empty
  // after substitution = analytics off.
  other: { 'agentage-ga': process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? '' },
};

export const viewport: Viewport = {
  themeColor: '#f3a52b',
  colorScheme: 'dark',
};

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Agentage',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
        width: 512,
        height: 512,
      },
      sameAs: [GITHUB_URL],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'SoftwareApplication',
      name: SITE_NAME,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      description: DESCRIPTION,
      url: SITE_URL,
      // Freemium: free to start, paid tiers above. AggregateOffer/lowPrice states
      // "from $0" without asserting free-only or advertising prices not shown on-page.
      offers: { '@type': 'AggregateOffer', lowPrice: '0', priceCurrency: 'USD' },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col antialiased bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        />
        <Header />
        <main className="flex-1 pt-4">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
