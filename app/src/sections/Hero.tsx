import { Link } from 'react-router-dom';
import { m } from 'motion/react';
import { ArrowRight, FileText, ArrowDown } from 'lucide-react';
import { StarsBackground } from '../components/animate-ui/backgrounds/stars';
import { SplittingText } from '../components/animate-ui/text/splitting';

const ROLES = ['Django', 'PostgreSQL', 'TimescaleDB', 'React', 'TypeScript'];

export default function Hero() {
  // Unconditional: MotionConfig reducedMotion="user" strips the transform and
  // settles opacity, so this stays correct without branching on a hook that is
  // null during SSR.
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const, delay },
  });

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex items-center bg-background overflow-hidden"
    >
      <StarsBackground className="absolute inset-0" />

      {/* Aurora wash — decorative, sits under the content */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[820px] h-[820px] max-w-[140vw] rounded-full bg-primary/12 blur-[130px]" />
        <div className="absolute bottom-0 inset-x-0 h-56 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 lg:px-10 py-32">
        <m.p
          {...rise(0.05)}
          className="inline-flex items-center gap-2.5 mb-8 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/70 motion-safe:animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Available for work
        </m.p>

        <h1
          className="font-display font-bold text-foreground leading-[0.95] mb-7"
          style={{ fontSize: 'clamp(3rem, 9vw, 6.5rem)', letterSpacing: '-0.04em' }}
        >
          <SplittingText text="Yousef" className="block" delay={0.1} />
          <SplittingText text="Selawi" className="block gradient-text" delay={0.22} />
        </h1>

        <m.p
          {...rise(0.4)}
          className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl mb-8"
        >
          Software engineer in Dubai. I build backends that stay fast when the
          data gets big — and the interfaces on top of them.
        </m.p>

        <m.ul {...rise(0.48)} className="flex flex-wrap gap-2 mb-10" aria-label="Core stack">
          {ROLES.map((r) => (
            <li
              key={r}
              className="px-3 py-1 rounded-full border border-border/80 bg-card/40 backdrop-blur-sm text-xs font-mono text-muted-foreground"
            >
              {r}
            </li>
          ))}
        </m.ul>

        <m.div {...rise(0.56)} className="flex flex-wrap items-center gap-3">
          <Link
            to="/work/harakti"
            className="group inline-flex items-center gap-2 px-6 min-h-[48px] rounded-lg bg-primary text-primary-foreground text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5 focus-ring cursor-pointer"
          >
            Read the Harakti case study
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          <Link
            to="/notes"
            className="inline-flex items-center gap-2 px-6 min-h-[48px] rounded-lg border border-border bg-card/50 backdrop-blur-sm text-sm font-medium text-foreground hover:border-primary/40 transition-colors duration-200 focus-ring cursor-pointer"
          >
            Engineering notes
          </Link>
          <a
            href="/Yousef_Resume.pdf"
            download
            className="inline-flex items-center gap-2 px-4 min-h-[48px] rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 focus-ring cursor-pointer"
          >
            <FileText className="w-4 h-4" aria-hidden="true" /> Résumé
          </a>
        </m.div>
      </div>

      <m.a
        {...rise(0.8)}
        href="#work"
        aria-label="Scroll to selected work"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:flex items-center justify-center w-11 h-11 rounded-full border border-border bg-card/50 backdrop-blur-sm text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors duration-200 focus-ring"
      >
        <ArrowDown className="w-4 h-4 motion-safe:animate-bounce" aria-hidden="true" />
      </m.a>
    </section>
  );
}
