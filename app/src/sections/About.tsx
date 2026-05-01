import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: '4+',   label: 'Years of experience' },
  { value: '1M+',  label: 'Data rows handled' },
  { value: '20+',  label: 'Dashboards shipped' },
  { value: '50+',  label: 'APIs built' },
];

const capabilities = [
  {
    title: 'Full-Stack Engineering',
    desc: 'Building end-to-end systems — from schema design to polished UI — using Django, React, and TypeScript.',
  },
  {
    title: 'Data & Performance',
    desc: 'Optimising queries and dual-database architectures (PostgreSQL + TimescaleDB) to serve millions of rows quickly.',
  },

];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = sectionRef.current?.querySelectorAll('[data-animate]') ?? [];
      els.forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 86%',
          once: true,
          onEnter: () => {
            gsap.fromTo(el,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }
            );
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-28 lg:py-36 bg-background"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        {/* Section label */}
        <p data-animate className="font-mono text-xs text-muted-foreground mb-4 tracking-widest uppercase">
          <span className="text-primary">//</span> about
        </p>

        {/* Headline */}
        <h2
          data-animate
          className="font-display font-bold text-foreground mb-12"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.025em' }}
        >
          Building things that<br />
          <span className="gradient-text">scale and perform</span>
        </h2>

        {/* Stats strip */}
        <div
          data-animate
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden mb-16"
        >
          {stats.map((s) => (
            <div key={s.label} className="bg-background px-6 py-7 flex flex-col gap-1">
              <span className="font-display font-bold text-primary" style={{ fontSize: '2.25rem', letterSpacing: '-0.03em' }}>
                {s.value}
              </span>
              <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-14 items-start">

          {/* Bio prose */}
          <div>
            <p data-animate className="text-muted-foreground leading-relaxed mb-4 text-base">
              I'm a Software Engineer at{' '}
              <span className="text-foreground font-medium">Kalvad</span> in Dubai, where I have worked since October 2021.
              I architect and maintain web applications and data systems used by thousands of people daily.
            </p>
            <p data-animate className="text-muted-foreground leading-relaxed text-base">
              I care deeply about clean code, observable systems, and shipping software that actually works at scale.
              Outside of work I enjoy exploring new tools and reading about distributed systems design.
            </p>
          </div>

          {/* Capability cards */}
          <div className="flex flex-col gap-4">
            {capabilities.map((cap, i) => (
              <div
                key={cap.title}
                data-animate
                className="card-solid rounded-xl p-5 border-accent-l hover:border-primary/40 hover:bg-secondary/30 transition-colors duration-200"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                <h3 className="font-display font-semibold text-foreground text-base mb-1.5">
                  {cap.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {cap.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
