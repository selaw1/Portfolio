import { Code2, Boxes, Database, Wrench, Palette, Terminal } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import SectionLabel from '../components/SectionLabel';

/**
 * The full stack, grouped so a recruiter can scan for a keyword in one pass.
 * `core` marks what I work in day to day — the rest is real experience, just
 * less current, and marking it is more honest than a flat list that implies
 * everything is equally deep.
 */
type Skill = { name: string; core?: boolean };

const groups: { icon: typeof Code2; name: string; span: string; items: Skill[] }[] = [
  {
    icon: Code2,
    name: 'Languages',
    span: 'lg:col-span-3',
    items: [
      { name: 'Python', core: true },
      { name: 'TypeScript', core: true },
      { name: 'JavaScript', core: true },
      { name: 'SQL', core: true },
      { name: 'HTML' },
      { name: 'CSS' },
      { name: 'SCSS' },
    ],
  },
  {
    icon: Boxes,
    name: 'Frameworks',
    span: 'lg:col-span-3',
    items: [
      { name: 'Django', core: true },
      { name: 'Django Ninja', core: true },
      { name: 'React', core: true },
      { name: 'Next.js' },
      { name: 'Astro' },
      { name: 'Vite' },
      { name: 'Capacitor' },
    ],
  },
  {
    icon: Database,
    name: 'Databases',
    span: 'lg:col-span-2',
    items: [
      { name: 'PostgreSQL', core: true },
      { name: 'TimescaleDB', core: true },
    ],
  },
  {
    icon: Wrench,
    name: 'Tools & Infra',
    span: 'lg:col-span-4',
    items: [
      { name: 'Celery', core: true },
      { name: 'RabbitMQ' },
      { name: 'LavinMQ' },
      { name: 'MinIO' },
      { name: 'Docker' },
      { name: 'TanStack Query', core: true },
      { name: 'Zustand', core: true },
      { name: 'Sentry' },
      { name: 'Git', core: true },
    ],
  },
  {
    icon: Palette,
    name: 'UI',
    span: 'lg:col-span-4',
    items: [
      { name: 'Tailwind CSS', core: true },
      { name: 'shadcn/ui', core: true },
      { name: 'Bootstrap', core: true },
    ],
  },
  {
    icon: Terminal,
    name: 'Environment',
    span: 'lg:col-span-2',
    items: [{ name: 'Linux (Arch)', core: true }],
  },
];

const total = groups.reduce((n, g) => n + g.items.length, 0);

export default function Skills() {
  return (
    <section id="stack" className="relative py-28 lg:py-36 bg-background">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <SectionLabel>stack</SectionLabel>

        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <Reveal className="max-w-xl">
            <h2
              className="font-display font-bold text-foreground mb-4"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', letterSpacing: '-0.03em' }}
            >
              What I work with
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Everything I've shipped with, grouped so you can find what you're
              looking for. {total} in total.
            </p>
          </Reveal>

          <Reveal index={1}>
            <p className="inline-flex items-center gap-2.5 text-xs font-mono text-muted-foreground border border-border rounded-full px-4 py-2">
              <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-primary" />
              Used day to day
            </p>
          </Reveal>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {groups.map(({ icon: Icon, name, span, items }, i) => (
            <Reveal
              key={name}
              index={i}
              className={`${span} rounded-2xl border border-border bg-card p-6 hover:border-primary/35 transition-colors duration-200`}
            >
              <div className="flex items-center gap-2.5 mb-5">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 text-primary shrink-0">
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </span>
                <h3 className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  {name}
                </h3>
                <span className="ml-auto font-mono text-xs text-muted-foreground/50 tabular-nums">
                  {items.length}
                </span>
              </div>

              <ul className="flex flex-wrap gap-2">
                {items.map(({ name: item, core }) => (
                  <li
                    key={item}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-colors duration-200 ${
                      core
                        ? 'bg-primary/10 border-primary/25 text-foreground font-medium'
                        : 'bg-secondary/60 border-border text-muted-foreground'
                    }`}
                  >
                    {/* A dot as well as colour — the legend must not depend on
                        hue alone to be readable. */}
                    {core && (
                      <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                    {item}
                    {core && <span className="sr-only"> — used day to day</span>}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
