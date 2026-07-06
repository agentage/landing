'use client';

import { useEffect } from 'react';

// Reading line below the sticky header where a section counts as active.
const LINE = 96;

// Progressive-enhancement scroll-spy: the TOC links render server-side and work
// without JS; this uses an IntersectionObserver to re-evaluate which section is
// under the reading line and highlight its link.
export function DocTocActive({ ids }: { ids: string[] }): null {
  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const links = new Map<string, HTMLElement>();
    for (const id of ids) {
      const el = document.querySelector<HTMLElement>(`[data-toc-link="${id}"]`);
      if (el) links.set(id, el);
    }

    let current = '';
    const setActive = (id: string): void => {
      if (id === current) return;
      current = id;
      for (const [key, el] of links) {
        const on = key === id;
        el.classList.toggle('text-foreground', on);
        el.classList.toggle('font-medium', on);
        el.classList.toggle('border-primary', on);
        el.classList.toggle('text-muted-foreground', !on);
        el.classList.toggle('border-transparent', !on);
        if (on) el.setAttribute('aria-current', 'true');
        else el.removeAttribute('aria-current');
      }
    };

    // Active = the last section whose top has crossed the reading line.
    const update = (): void => {
      let active = sections[0]?.id ?? '';
      for (const sec of sections) {
        if (sec.getBoundingClientRect().top - LINE <= 0) active = sec.id;
      }
      setActive(active);
    };

    const observer = new IntersectionObserver(update, {
      rootMargin: `-${LINE}px 0px -80% 0px`,
      threshold: 0,
    });
    for (const sec of sections) observer.observe(sec);
    update();

    return () => observer.disconnect();
  }, [ids]);

  return null;
}
