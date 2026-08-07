import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import SectionLabel from '../components/SectionLabel';

const featured = {
  title: 'Harakti',
  tagline: 'Bilingual gym tracker',
  platforms: ['iOS', 'Android', 'Web'],
  description:
    "Local-first logging built for gyms with no signal, streaks that survive rest days, and a leaderboard I shipped knowing exactly where it breaks. Solo — product, backend, frontend and the mobile shell.",
  image: '/work/harakti/receipt.webp',
  imageAlt: 'Harakti session receipt in Arabic, with full right-to-left layout',
  tech: ['Django', 'Django Ninja', 'PostgreSQL', 'Celery', 'LavinMQ', 'React', 'Zustand', 'Capacitor'],
  caseStudy: '/work/harakti',
  href: 'https://harakti.com',
};


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

                <ul className="flex flex-wrap gap-2 mb-5" aria-label="Available on">
                  {featured.platforms.map((platform) => (
                    <li
                      key={platform}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-primary/25 bg-primary/10 text-xs font-medium text-foreground"
                    >
                      <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {platform}
                    </li>
                  ))}
                </ul>
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

      </div>
    </section>
  );
}
