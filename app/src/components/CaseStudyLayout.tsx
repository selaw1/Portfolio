import type { ReactNode } from 'react';
import { Reveal } from './Reveal';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { type WorkMeta } from '../notes/registry';

interface Props {
  work: WorkMeta;
  children: ReactNode;
}

export default function CaseStudyLayout({ work, children }: Props) {
  return (
    <article className="pt-32 pb-28 lg:pb-36 bg-background">
      <div className="max-w-3xl mx-auto px-6 lg:px-10">

        <Reveal>
          <Link
            to="/#work"
            className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors duration-200 focus-ring rounded mb-10"
          >
            <ArrowLeft className="w-3 h-3" aria-hidden="true" /> work
          </Link>

          <h1
            className="font-display font-bold text-foreground mb-4"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 3.25rem)', letterSpacing: '-0.03em' }}
          >
            {work.title}
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            {work.tagline}
          </p>

          <dl className="grid sm:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden mb-8">
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

          <div className="flex flex-wrap gap-2 mb-14">
            {work.stack.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
        </Reveal>

        <div className="note-prose">{children}</div>

        <hr className="border-border my-14" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            to="/#work"
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

