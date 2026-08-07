import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import SectionLabel from '../components/SectionLabel';
import { NOTES, formatNoteDate, notePath } from '../notes/registry';

export default function NotesTeaser() {
  return (
    <section id="notes" className="relative py-28 lg:py-36 bg-secondary/25">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <SectionLabel>notes</SectionLabel>

        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <Reveal className="max-w-xl">
            <h2
              className="font-display font-bold text-foreground mb-4"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', letterSpacing: '-0.03em' }}
            >
              Things I've worked out
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Short technical notes, each built around a demo you can drive
              rather than a code listing you read.
            </p>
          </Reveal>

          <Reveal index={1}>
            <Link
              to="/notes"
              className="group inline-flex items-center gap-2 min-h-[44px] text-sm font-medium text-primary hover:underline focus-ring rounded cursor-pointer"
            >
              All notes
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {NOTES.map((note, i) => (
            <Reveal key={note.slug} index={i}>
              <Link
                to={notePath(note.slug)}
                className="group flex flex-col h-full rounded-2xl border border-border bg-card p-7 sm:p-8 hover:border-primary/35 transition-colors duration-200 focus-ring"
              >
                <div className="flex flex-wrap items-center gap-3 mb-4 text-xs font-mono text-muted-foreground">
                  <time dateTime={note.date} className="tabular-nums">
                    {formatNoteDate(note.date)}
                  </time>
                  <span aria-hidden="true">·</span>
                  <span>{note.readingMinutes} min read</span>
                </div>

                <h3 className="font-display font-bold text-foreground text-2xl mb-3 tracking-tight group-hover:text-primary transition-colors duration-200">
                  {note.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                  {note.blurb}
                </p>

                <ul className="flex flex-wrap gap-2 mb-6">
                  {note.tags.map((t) => <li key={t} className="tag">{t}</li>)}
                </ul>

                <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                  Read the note
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
