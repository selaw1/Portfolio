import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

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
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = sectionRef.current?.querySelectorAll('[data-animate]') ?? [];
      items.forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 87%',
          once: true,
          onEnter: () => {
            gsap.fromTo(el,
              { opacity: 0, y: 18 },
              { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
            );
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="py-28 lg:py-36 bg-background">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        {/* Label */}
        <p data-animate className="font-mono text-xs text-muted-foreground mb-4 tracking-widest uppercase">
          <span className="text-primary">//</span> experience
        </p>

        {/* Headline */}
        <h2
          data-animate
          className="font-display font-bold text-foreground mb-16"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.025em' }}
        >
          Where I've worked
        </h2>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-border" aria-hidden="true" />

          {experiences.map((exp) => (
            <div key={exp.company} className="pl-8 relative">
              {/* Timeline dot */}
              <div
                className="absolute left-0 top-[6px] w-[9px] h-[9px] rounded-full bg-primary -translate-x-[4px]"
                aria-hidden="true"
              />

              {/* Header */}
              <div data-animate className="mb-5">
                <div className="flex flex-wrap items-baseline gap-2 mb-1">
                  <h3 className="font-display font-bold text-foreground text-xl">{exp.company}</h3>
                  <span className="text-muted-foreground text-sm">·</span>
                  <span className="text-sm text-muted-foreground font-medium">{exp.role}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground">
                  <span>{exp.period}</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" aria-hidden="true" />
                    {exp.location}
                  </span>
                </div>
              </div>

              {/* Bullets */}
              <ul className="mb-6 flex flex-col gap-3">
                {exp.description.map((line, i) => (
                  <li
                    key={i}
                    data-animate
                    className="text-sm text-muted-foreground leading-relaxed flex gap-3"
                    style={{ transitionDelay: `${i * 40}ms` }}
                  >
                    <span className="mt-[6px] shrink-0 w-1 h-1 rounded-full bg-primary/60" aria-hidden="true" />
                    {line}
                  </li>
                ))}
              </ul>

              {/* Tech stack */}
              <div data-animate className="flex flex-wrap gap-2 mb-2">
                {exp.techStack.map((tech) => (
                  <span key={tech} className="tag">{tech}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
