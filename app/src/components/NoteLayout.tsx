import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from './Reveal';
import { ArrowLeft } from 'lucide-react';
import { formatNoteDate, type NoteMeta } from '../notes/registry';

interface Props {
  note: NoteMeta;
  children: ReactNode;
}

export default function NoteLayout({ note, children }: Props) {


  return (
    <article className="pt-32 pb-28 lg:pb-36 bg-background">
      <div className="max-w-3xl mx-auto px-6 lg:px-10">

        <Reveal>
          <Link
            to="/notes"
            className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors duration-200 focus-ring rounded mb-10"
          >
            <ArrowLeft className="w-3 h-3" aria-hidden="true" /> all notes
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4 text-xs font-mono text-muted-foreground">
            <time dateTime={note.date}>{formatNoteDate(note.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{note.readingMinutes} min read</span>
          </div>

          <h1
            className="font-display font-bold text-foreground mb-6"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', letterSpacing: '-0.03em' }}
          >
            {note.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-12">
            {note.tags.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
        </Reveal>

        <div className="note-prose">{children}</div>

        <hr className="border-border my-14" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            to="/notes"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline focus-ring rounded"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> All notes
          </Link>
          <a
            href="mailto:yousef@selawii.com"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 focus-ring rounded"
          >
            Think I got something wrong? Tell me.
          </a>
        </div>
      </div>
    </article>
  );
}
