'use client';
import { useEffect, useState } from 'react';
import Script from 'next/script';

// Google Analytics 4 (gtag.js). Off unless a GA measurement id is configured.
// The id is read at RUNTIME from the <meta name="agentage-ga"> tag (rendered by
// the layout, substituted from GA_MEASUREMENT_ID at container start) - NOT from
// an inlined NEXT_PUBLIC_* constant: the image bakes a truthy sentinel, so an
// inlined `if (!GA_ID)` guard would be dead-code-eliminated at build and dev
// would load gtag with an empty id. A DOM read can't be constant-folded.
// Note: GA sets cookies and sends data to Google (US) - EU visitors likely
// need a consent gate before this loads.

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const readGaId = (): string => {
  const id = document.querySelector('meta[name="agentage-ga"]')?.getAttribute('content') ?? '';
  // An un-substituted sentinel means the entrypoint did not run - treat as off.
  return id.startsWith('__') ? '' : id;
};

export function Analytics() {
  const [gaId, setGaId] = useState('');
  useEffect(() => setGaId(readGaId()), []);
  if (!gaId) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
      </Script>
    </>
  );
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined') window.gtag?.('event', name, params);
}
