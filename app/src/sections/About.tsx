import { Database, Layers, Languages } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { CountingNumber } from '../components/animate-ui/text/counting-number';
import SectionLabel from '../components/SectionLabel';

/**
 * Every figure here is checkable: years since Oct 2021, the two products
 * linked further down the page, and the two languages Harakti ships in.
 */
const stats = [
  { value: 4, suffix: '+', label: 'Years shipping production systems' },
  { value: 2, suffix: '', label: 'Products shipped and live' },
  { value: 2, suffix: '', label: 'Languages, full RTL' },
];

const capabilities = [
  {
    icon: Database,
    title: 'Data that stays fast',
    body: 'Dual-database architectures on PostgreSQL and TimescaleDB — hypertables, continuous aggregates, compression — so time-series queries stay flat as the table grows.',
  },
  {
    icon: Layers,
    title: 'End-to-end ownership',
    body: 'Schema design through to the interface. Django and Django Ninja on the back, React and TypeScript on the front, and the async pipelines wiring them together.',
  },
  {
    icon: Languages,
    title: 'Built for two directions',
    body: 'Arabic as a first-class target rather than a locale file — full right-to-left layout reaching into charts, calendars and every asymmetric value in the codebase.',
  },
];

export default function About() {
  return (
    <section id="about" className="relative py-28 lg:py-36 bg-background">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <SectionLabel>about</SectionLabel>

        <Reveal>
          <h2
            className="font-display font-bold text-foreground mb-8 max-w-3xl"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', letterSpacing: '-0.03em' }}
          >
            I build things that hold up{' '}
            <span className="gradient-text">at production scale</span>
          </h2>
        </Reveal>

        <Reveal index={1}>
          <div className="grid gap-6 lg:grid-cols-2 mb-16 max-w-4xl">
            <p className="text-muted-foreground leading-relaxed">
              I'm a software engineer at{' '}
              <span className="text-foreground font-medium">Kalvad</span> in Dubai, where I've
              worked since October 2021 on data platforms for government clients — the kind where
              a slow dashboard is somebody's actual afternoon.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Outside that I ship my own products. Harakti is a bilingual gym tracker on Google
              Play and the web, built solo end to end. It's where I get to make the architectural
              calls and then live with them.
            </p>
          </div>
        </Reveal>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden mb-16">
          {stats.map((s, i) => (
            <Reveal key={s.label} index={i} className="bg-card px-6 py-8">
              <div
                className="font-display font-bold text-primary tabular-nums mb-1.5"
                style={{ fontSize: '2.75rem', letterSpacing: '-0.04em' }}
              >
                <CountingNumber number={s.value} />
                {s.suffix}
              </div>
              <p className="text-sm text-muted-foreground leading-snug">{s.label}</p>
            </Reveal>
          ))}
        </div>

        {/* Capabilities */}
        <div className="grid gap-4 md:grid-cols-3">
          {capabilities.map(({ icon: Icon, title, body }, i) => (
            <Reveal
              key={title}
              index={i}
              className="group relative rounded-2xl border border-border bg-card p-6 hover:border-primary/40 transition-colors duration-200"
            >
              <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-display font-semibold text-foreground text-base mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
