import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { ArrowLeft, ArrowUpRight, Rss } from 'lucide-react';
import { NOTES, formatNoteDate, notePath } from '../notes/registry';

export default function NotesIndex() {


  return (
    <div className="pt-32 pb-28 lg:pb-36 bg-background min-h-screen">
      <div className="max-w-3xl mx-auto px-6 lg:px-10">

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors duration-200 focus-ring rounded mb-10"
        >
          <ArrowLeft className="w-3 h-3" aria-hidden="true" /> home
        </Link>

        <h1
          className="font-display font-bold text-foreground mb-5"
          style={{ fontSize: 'clamp(2.2rem, 5vw, 3.25rem)', letterSpacing: '-0.03em' }}
        >
          Notes
        </h1>

        <p className="text-muted-foreground leading-relaxed mb-14 max-w-xl">
          Short technical notes on the things I spend my days inside — Django, Postgres, and
          time-series data. Each one is built around a demo you can drive rather than a code listing
          you read.
        </p>

        <Reveal>
          <a
            href="/rss.xml"
            className="inline-flex items-center gap-2 mb-10 px-4 min-h-[44px] rounded-lg border border-border bg-card text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors duration-200 focus-ring cursor-pointer"
          >
            <Rss className="w-4 h-4" aria-hidden="true" />
            Subscribe by RSS
          </a>
        </Reveal>

        <div className="flex flex-col gap-4">
          {NOTES.map((note, i) => (
            <Reveal key={note.slug} index={i}>
            <Link
              to={notePath(note.slug)}
              className="group card-solid rounded-2xl p-6 sm:p-8 hover:border-primary/30 transition-colors duration-200 focus-ring block"
            >
              <div className="flex flex-wrap items-center gap-3 mb-3 text-xs font-mono text-muted-foreground">
                <time dateTime={note.date}>{formatNoteDate(note.date)}</time>
                <span aria-hidden="true">·</span>
                <span>{note.readingMinutes} min read</span>
              </div>

              <h2 className="font-display font-bold text-foreground text-2xl mb-3 group-hover:text-primary transition-colors duration-200">
                {note.title}
              </h2>

              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {note.blurb}
              </p>

              <div className="flex flex-wrap items-center gap-2 mb-5">
                {note.tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>

              <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                Read the note <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </span>
            </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
