import {
  NOTES, SITE_URL, WORK, notePath, workPath,
  type NoteMeta, type WorkMeta,
} from '../notes/registry';

export interface PageMeta {
  title: string;
  description: string;
  /** Absolute canonical URL. */
  url: string;
  /** 'article' for notes and case studies, 'website' otherwise. */
  ogType: 'website' | 'article';
  publishedTime?: string;
}

const HOME: PageMeta = {
  title: 'Yousef Selawi — Software Engineer',
  description:
    'Software engineer in Dubai building Django and React systems on Postgres and TimescaleDB. Case studies and notes on database performance and backend architecture.',
  url: SITE_URL,
  ogType: 'website',
};

const NOTES_INDEX: PageMeta = {
  title: 'Notes — Yousef Selawi',
  description:
    'Short, interactive engineering notes on Django, PostgreSQL, and TimescaleDB — each one built around a demo you can drive rather than a code listing you read.',
  url: `${SITE_URL}/notes`,
  ogType: 'website',
};

function noteMeta(note: NoteMeta): PageMeta {
  return {
    title: `${note.title} — Yousef Selawi`,
    description: note.description,
    url: `${SITE_URL}${notePath(note.slug)}`,
    ogType: 'article',
    publishedTime: note.date,
  };
}

function workMeta(work: WorkMeta): PageMeta {
  return {
    title: `${work.title} — Case study — Yousef Selawi`,
    description: work.description,
    url: `${SITE_URL}${workPath(work.slug)}`,
    ogType: 'article',
  };
}

/** Every route the prerenderer emits, in sitemap order. */
export const ROUTES: string[] = [
  '/',
  ...WORK.map((w) => workPath(w.slug)),
  '/notes',
  ...NOTES.map((n) => notePath(n.slug)),
];

export function metaForPath(path: string): PageMeta {
  const clean = path.replace(/\/+$/, '') || '/';
  if (clean === '/') return HOME;
  if (clean === '/notes') return NOTES_INDEX;

  const note = NOTES.find((n) => notePath(n.slug) === clean);
  if (note) return noteMeta(note);

  const work = WORK.find((w) => workPath(w.slug) === clean);
  if (work) return workMeta(work);

  return HOME;
}
