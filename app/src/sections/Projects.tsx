import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Github } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import SectionLabel from '../components/SectionLabel';

const featured = {
  title: 'Harakti',
  tagline: 'Bilingual gym tracker · Android + web',
  description:
    "Local-first logging built for gyms with no signal, streaks that survive rest days, and a leaderboard I shipped knowing exactly where it breaks. Solo — product, backend, frontend and the mobile shell.",
  image: '/work/harakti/receipt.webp',
  imageAlt: 'Harakti session receipt in Arabic, with full right-to-left layout',
  tech: ['Django', 'Django Ninja', 'PostgreSQL', 'Celery', 'LavinMQ', 'React', 'Zustand', 'Capacitor'],
  caseStudy: '/work/harakti',
  href: 'https://harakti.com',
};

const others = [
  {
    title: 'Minbur',
    description:
      'A Skool.com-style community platform enabling creators to monetize content and manage memberships. Features JWT auth, Stripe, and cloud-based file storage.',
    tech: ['Next.js', 'Django Ninja', 'PostgreSQL', 'JWT', 'Stripe', 'MinIO'],
    href: 'https://github.com/MinburTech/MinburBackend',
  },
];

export default function Projects() {
  return (
    <section id="work" className="relative py-28 lg:py-36 bg-secondary/25">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <SectionLabel>work</SectionLabel>

        <Reveal>
          <h2
            className="font-display font-bold text-foreground mb-14"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', letterSpacing: '-0.03em' }}
          >
            Selected work
          </h2>
        </Reveal>

        {/* Featured */}
        <Reveal>
          <article className="group relative rounded-3xl border border-border bg-card overflow-hidden hover:border-primary/35 transition-colors duration-300">
            <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
              {/* Shot */}
              <div className="relative flex items-center justify-center p-8 sm:p-10 overflow-hidden">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent"
                />
                <img
                  src={featured.image}
                  alt={featured.imageAlt}
                  loading="lazy"
                  width={720}
                  height={1280}
                  className="relative max-h-64 lg:max-h-[400px] w-auto rounded-2xl shadow-2xl transition-transform duration-500 group-hover:-translate-y-1.5"
                />
              </div>

              {/* Copy */}
              <div className="p-7 sm:p-10 flex flex-col justify-center">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary mb-4">
                  {featured.tagline}
                </p>
                <h3 className="font-display font-bold text-foreground text-3xl sm:text-4xl mb-4 tracking-tight">
                  {featured.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                  {featured.description}
                </p>

                <ul className="flex flex-wrap gap-2 mb-8">
                  {featured.tech.map((t) => (
                    <li key={t} className="tag">{t}</li>
                  ))}
                </ul>

                <div className="flex flex-wrap items-center gap-5">
                  <Link
                    to={featured.caseStudy}
                    className="group/cta inline-flex items-center gap-2 px-5 min-h-[48px] rounded-lg bg-primary text-primary-foreground text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5 focus-ring cursor-pointer"
                  >
                    Read the case study
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/cta:translate-x-0.5" aria-hidden="true" />
                  </Link>
                  <a
                    href={featured.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 min-h-[48px] text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 focus-ring rounded cursor-pointer"
                  >
                    Visit site <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </article>
        </Reveal>

        {/* Others */}
        <div className="grid md:grid-cols-2 gap-5 mt-5">
          {others.map((p, i) => (
            <Reveal key={p.title} index={i}>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col h-full rounded-2xl border border-border bg-card p-7 hover:border-primary/35 transition-colors duration-200 focus-ring"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-display font-bold text-foreground text-xl group-hover:text-primary transition-colors duration-200">
                    {p.title}
                  </h3>
                  <Github className="w-4 h-4 shrink-0 mt-1 text-muted-foreground group-hover:text-primary transition-colors duration-200" aria-hidden="true" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                  {p.description}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {p.tech.map((t) => <li key={t} className="tag">{t}</li>)}
                </ul>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
