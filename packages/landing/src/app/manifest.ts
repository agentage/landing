import type { MetadataRoute } from 'next';
import { SITE_NAME, SITE_TAGLINE } from '../lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: 'Agentage',
    description: SITE_TAGLINE,
    start_url: '/',
    display: 'standalone',
    background_color: '#0f1117',
    theme_color: '#f3a52b',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  };
}
