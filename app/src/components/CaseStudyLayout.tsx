import { useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { type WorkMeta } from '../notes/registry';

interface Props {
  work: WorkMeta;
  children: ReactNode;
}

export default function CaseStudyLayout({ work, children }: Props) {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = headerRef.current?.querySelectorAll('[data-enter]') ?? [];
      gsap.fromTo(Array.from(els),
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.06 }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <article className="pt-32 pb-28 lg:pb-36 bg-background">
      <div className="max-w-3xl mx-auto px-6 lg:px-10">

        <div ref={headerRef}>
          <Link
            data-enter
            to="/#projects"
            className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors duration-200 focus-ring rounded mb-10"
          >
            <ArrowLeft className="w-3 h-3" aria-hidden="true" /> work
          </Link>

          <h1
            data-enter
            className="font-display font-bold text-foreground mb-4"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 3.25rem)', letterSpacing: '-0.03em' }}
          >
            {work.title}
          </h1>

          <p data-enter className="text-lg text-muted-foreground leading-relaxed mb-8">
            {work.tagline}
          </p>

          <dl data-enter className="grid sm:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden mb-8">
            {[
              { k: 'Role', v: work.role },
              { k: 'Status', v: work.period },
              { k: 'Live at', v: 'harakti.com', href: work.liveUrl },
            ].map(({ k, v, href }) => (
              <div key={k} className="bg-card px-5 py-4 flex flex-col gap-1">
                <dt className="text-xs font-mono text-muted-foreground uppercase tracking-widest">{k}</dt>
                <dd className="text-sm text-foreground">
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline focus-ring rounded"
                    >
                      {v} <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                    </a>
                  ) : v}
                </dd>
              </div>
            ))}
          </dl>

          <div data-enter className="flex flex-wrap gap-2 mb-14">
            {work.stack.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
        </div>

        <div className="note-prose">{children}</div>

        <hr className="border-border my-14" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline focus-ring rounded"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> All work
          </Link>
          <a
            href="mailto:yousef@selawii.com"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 focus-ring rounded"
          >
            Want the longer version? Ask me.
          </a>
        </div>
      </div>
    </article>
  );
}

/** Phone-sized product screenshot with a caption. */
export function Shot({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure className="my-10">
      <div className="flex justify-center">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="rounded-2xl border border-border max-h-[520px] w-auto"
        />
      </div>
      <figcaption className="text-xs text-muted-foreground/70 text-center mt-3 leading-relaxed">
        {caption}
      </figcaption>
    </figure>
  );
}

/** Two screenshots side by side on desktop, stacked on mobile. */
export function ShotPair({
  shots,
  caption,
}: {
  shots: { src: string; alt: string }[];
  caption: string;
}) {
  return (
    <figure className="my-10">
      <div className="grid sm:grid-cols-2 gap-4 justify-items-center">
        {shots.map((s) => (
          <img
            key={s.src}
            src={s.src}
            alt={s.alt}
            loading="lazy"
            className="rounded-2xl border border-border max-h-[460px] w-auto"
          />
        ))}
      </div>
      <figcaption className="text-xs text-muted-foreground/70 text-center mt-3 leading-relaxed">
        {caption}
      </figcaption>
    </figure>
  );
}
