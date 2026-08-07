import { MapPin, Building2 } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import SectionLabel from '../components/SectionLabel';

/* Content is unchanged from the previous version — only the presentation
   around it has been rebuilt. */
const experiences = [
  {
    company: 'Kalvad',
    role: 'Software Engineer',
    location: 'Dubai, UAE',
    period: 'October 2021 – Present',
    description: [
      'Architected dual-database infrastructure using PostgreSQL and TimescaleDB hypertables with continuous aggregates and compression, improving time-series query performance for millions of records.',
      'Engineered robust async pipelines with Celery and RabbitMQ — 15+ scheduled jobs for data sync, ML model training, and large-scale exports of 1M+ rows.',
      'Built high-performance REST APIs with Django Ninja, JWT auth, and role-based access control, serving 20+ real-time dashboards.',
      'Implemented enterprise-grade authentication: 2FA, UAEPass, LDAP/Active Directory, API key management, and field-level audit logs.',
      'Optimised database and app performance via indexing, N+1 elimination, and streaming large exports through MinIO.',
      'Developed 20+ dynamic dashboards using React, Zustand, React Query, and Hey API with automatic schema generation.',
    ],
    techStack: [
      'Django', 'TimescaleDB', 'PostgreSQL', 'Celery', 'RabbitMQ',
      'Django Ninja', 'MinIO', 'Docker', 'Sentry',
      'React', 'TanStack Query', 'Zustand',
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="relative py-28 lg:py-36 bg-background">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <SectionLabel>experience</SectionLabel>

        <Reveal>
          <h2
            className="font-display font-bold text-foreground mb-14"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', letterSpacing: '-0.03em' }}
          >
            Where I've worked
          </h2>
        </Reveal>

        {experiences.map((exp) => (
          <Reveal key={exp.company}>
            <article className="rounded-3xl border border-border bg-card overflow-hidden">
              {/* Header */}
              <header className="relative p-6 sm:p-8 border-b border-border">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-transparent to-transparent"
                />
                <div className="relative flex flex-wrap items-start justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <span className="shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 border border-primary/25 text-primary">
                      <Building2 className="w-5 h-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-display font-bold text-foreground text-2xl leading-tight">
                        {exp.company}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{exp.role}</p>
                    </div>
                  </div>

                  <dl className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-mono text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <dt className="sr-only">Period</dt>
                      <dd className="tabular-nums">{exp.period}</dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <dt className="sr-only">Location</dt>
                      <dd className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                        {exp.location}
                      </dd>
                    </div>
                  </dl>
                </div>
              </header>

              {/* Responsibilities — numbered so each one reads as a discrete piece of work */}
              <ol className="divide-y divide-border">
                {exp.description.map((line, i) => (
                  <li
                    key={i}
                    className="group flex gap-4 sm:gap-6 px-6 sm:px-8 py-5 hover:bg-secondary/40 transition-colors duration-200"
                  >
                    <span
                      aria-hidden="true"
                      className="shrink-0 font-mono text-xs text-muted-foreground/50 tabular-nums pt-0.5 group-hover:text-primary transition-colors duration-200"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-sm text-muted-foreground leading-relaxed">{line}</p>
                  </li>
                ))}
              </ol>

              {/* Stack */}
              <footer className="px-6 sm:px-8 py-6 border-t border-border bg-secondary/20">
                <h4 className="sr-only">Technologies used at {exp.company}</h4>
                <ul className="flex flex-wrap gap-2">
                  {exp.techStack.map((tech) => (
                    <li key={tech} className="tag">{tech}</li>
                  ))}
                </ul>
              </footer>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
