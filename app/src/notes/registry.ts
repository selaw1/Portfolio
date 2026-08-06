/**
 * Single source of truth for the notes. Drives the routes, the index page,
 * the per-page <head> tags injected at prerender time, and the sitemap —
 * so adding a note means adding one entry here plus its component.
 */

export const SITE_URL = 'https://yousef.selawii.com';

export interface NoteMeta {
  slug: string;
  title: string;
  /** Used verbatim as the meta description and OG description. */
  description: string;
  /** Short pitch for the index and homepage cards. */
  blurb: string;
  /** ISO date — drives sitemap lastmod and the visible dateline. */
  date: string;
  readingMinutes: number;
  tags: string[];
}

export const NOTES: NoteMeta[] = [
  {
    slug: 'n-plus-one',
    title: "The N+1 you can't see",
    description:
      'An interactive look at why Django N+1 bugs survive code review: they are invisible at the size you develop at, and linear in a number that only grows in production.',
    blurb:
      'Why this bug passes review every time — and the one-line test that stops it.',
    date: '2026-08-06',
    readingMinutes: 4,
    tags: ['Django', 'PostgreSQL', 'Performance'],
  },
];

export function noteBySlug(slug: string): NoteMeta | undefined {
  return NOTES.find((n) => n.slug === slug);
}

export function notePath(slug: string): string {
  return `/notes/${slug}`;
}

export function formatNoteDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
