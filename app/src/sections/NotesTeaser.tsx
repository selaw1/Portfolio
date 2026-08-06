import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { NOTES, formatNoteDate, notePath } from '../notes/registry';

gsap.registerPlugin(ScrollTrigger);

export default function NotesTeaser() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = sectionRef.current?.querySelectorAll('[data-animate]') ?? [];
      els.forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 87%',
          once: true,
          onEnter: () => {
            gsap.fromTo(el,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }
            );
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="notes" ref={sectionRef} className="py-28 lg:py-36 bg-background">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        <p data-animate className="font-mono text-xs text-muted-foreground mb-4 tracking-widest uppercase">
          <span className="text-primary">//</span> notes
        </p>

        <h2
          data-animate
          className="font-display font-bold text-foreground mb-4"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.025em' }}
        >
          Things I've worked out
        </h2>

        <p data-animate className="text-muted-foreground leading-relaxed max-w-xl mb-12">
          Short technical notes, each built around a demo you can drive rather than a code listing
          you read.
        </p>

        <div className="flex flex-col gap-4">
          {NOTES.map((note) => (
            <Link
              key={note.slug}
              to={notePath(note.slug)}
              data-animate
              className="group card-solid rounded-2xl p-6 sm:p-8 hover:border-primary/30 transition-colors duration-200 focus-ring block"
            >
              <div className="flex flex-wrap items-center gap-3 mb-3 text-xs font-mono text-muted-foreground">
                <time dateTime={note.date}>{formatNoteDate(note.date)}</time>
                <span aria-hidden="true">·</span>
                <span>{note.readingMinutes} min read</span>
              </div>

              <h3 className="font-display font-bold text-foreground text-2xl mb-3 group-hover:text-primary transition-colors duration-200">
                {note.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-2xl">
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
    </section>
  );
}
