import { Server, Database, MonitorSmartphone, Boxes } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import SectionLabel from '../components/SectionLabel';

/**
 * Deliberately short. These are the things I'd defend under questioning —
 * a longer list reads as recall, not depth.
 */
const groups = [
  {
    icon: Server,
    name: 'Backend',
    items: ['Python', 'Django', 'Django Ninja', 'Celery'],
  },
  {
    icon: Database,
    name: 'Data',
    items: ['PostgreSQL', 'TimescaleDB', 'RabbitMQ', 'MinIO'],
  },
  {
    icon: MonitorSmartphone,
    name: 'Frontend',
    items: ['TypeScript', 'React', 'TanStack Query', 'Zustand'],
  },
  {
    icon: Boxes,
    name: 'Platform',
    items: ['Docker', 'Capacitor', 'Sentry', 'Linux'],
  },
];

export default function Skills() {
  return (
    <section id="stack" className="relative py-28 lg:py-36 bg-background">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <SectionLabel>stack</SectionLabel>

        <Reveal>
          <h2
            className="font-display font-bold text-foreground mb-4"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', letterSpacing: '-0.03em' }}
          >
            What I reach for
          </h2>
        </Reveal>

        <Reveal index={1}>
          <p className="text-muted-foreground leading-relaxed max-w-xl mb-14">
            A short list on purpose. These are the tools I've shipped and
            debugged in production, not everything I've opened a tutorial for.
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map(({ icon: Icon, name, items }, i) => (
            <Reveal
              key={name}
              index={i}
              className="rounded-2xl border border-border bg-card p-6 hover:border-primary/35 transition-colors duration-200"
            >
              <div className="flex items-center gap-2.5 mb-5">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </span>
                <h3 className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  {name}
                </h3>
              </div>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-foreground">
                    <span
                      aria-hidden="true"
                      className="w-1 h-1 rounded-full bg-primary/70 shrink-0"
                    />
                    {item}
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
