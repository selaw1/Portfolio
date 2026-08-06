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

export interface WorkMeta {
  slug: string;
  title: string;
  /** One line under the title on the case-study page itself. */
  tagline: string;
  description: string;
  blurb: string;
  /** Shipping status, shown as a dateline. */
  period: string;
  role: string;
  stack: string[];
  liveUrl?: string;
}

export const WORK: WorkMeta[] = [
  {
    slug: 'harakti',
    title: 'Harakti',
    tagline: 'A bilingual gym tracker, shipped on Android and the web.',
    description:
      'Case study of Harakti, a bilingual English/Arabic gym tracking app: local-first session logging built for basement gyms with no signal, timezone-correct streaks with a rest-day grace period, and the leaderboard tradeoff I shipped on purpose.',
    blurb:
      'Local-first logging for gyms with no signal, streaks that survive rest days, and a leaderboard I shipped knowing exactly where it breaks.',
    period: 'Shipped 2026 · Android + web',
    role: 'Solo — product, backend, frontend, mobile',
    stack: [
      'Django', 'Django Ninja', 'PostgreSQL', 'Celery', 'LavinMQ',
      'React', 'TanStack Query', 'Zustand', 'Capacitor', 'JWT',
    ],
    liveUrl: 'https://harakti.com',
  },
];

export function noteBySlug(slug: string): NoteMeta | undefined {
  return NOTES.find((n) => n.slug === slug);
}

export function workBySlug(slug: string): WorkMeta | undefined {
  return WORK.find((w) => w.slug === slug);
}

export function workPath(slug: string): string {
  return `/work/${slug}`;
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
