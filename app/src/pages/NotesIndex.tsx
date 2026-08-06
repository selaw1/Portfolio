import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { NOTES, formatNoteDate, notePath } from '../notes/registry';

export default function NotesIndex() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = rootRef.current?.querySelectorAll('[data-enter]') ?? [];
      gsap.fromTo(Array.from(els),
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.06 }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="pt-32 pb-28 lg:pb-36 bg-background min-h-screen">
      <div ref={rootRef} className="max-w-3xl mx-auto px-6 lg:px-10">

        <Link
          data-enter
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors duration-200 focus-ring rounded mb-10"
        >
          <ArrowLeft className="w-3 h-3" aria-hidden="true" /> home
        </Link>

        <h1
          data-enter
          className="font-display font-bold text-foreground mb-5"
          style={{ fontSize: 'clamp(2.2rem, 5vw, 3.25rem)', letterSpacing: '-0.03em' }}
        >
          Notes
        </h1>

        <p data-enter className="text-muted-foreground leading-relaxed mb-14 max-w-xl">
          Short technical notes on the things I spend my days inside — Django, Postgres, and
          time-series data. Each one is built around a demo you can drive rather than a code listing
          you read.
        </p>

        <div className="flex flex-col gap-4">
          {NOTES.map((note) => (
            <Link
              key={note.slug}
              to={notePath(note.slug)}
              data-enter
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
          ))}
        </div>
      </div>
    </div>
  );
}
