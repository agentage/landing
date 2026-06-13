import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Local cn — do NOT re-export from @agentage/design-system. Importing the DS
// barrel here pulls client-only modules (one touches `document` at module
// scope) into server-rendered pages and breaks `next build` prerender
// (e.g. /_not-found). The DS theme is consumed via CSS (@import), not JS.
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
