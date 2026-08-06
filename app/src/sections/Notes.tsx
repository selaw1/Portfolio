import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NPlusOneDemo from '../notes/NPlusOneDemo';

gsap.registerPlugin(ScrollTrigger);

export default function Notes() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = sectionRef.current?.querySelectorAll('[data-animate]') ?? [];
      els.forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 87%',
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
    <section id="notes" ref={sectionRef} className="py-28 lg:py-36 bg-background">
      <div className="max-w-4xl mx-auto px-6 lg:px-10">

        {/* Label */}
        <p data-animate className="font-mono text-xs text-muted-foreground mb-4 tracking-widest uppercase">
          <span className="text-primary">//</span> notes
        </p>

        {/* Headline */}
        <h2
          data-animate
          className="font-display font-bold text-foreground mb-6"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.025em' }}
        >
          The N+1 you can't see
        </h2>

        <div data-animate className="flex flex-col gap-4 mb-10">
          <p className="text-muted-foreground leading-relaxed">
            Every Django codebase has one. It passes review, passes tests, and ships — because on a
            development database with a dozen rows, the difference is single-digit milliseconds.
            The ORM gives you no signal at all: <code className="font-mono text-xs text-foreground/80">route.stops.all()</code>{' '}
            reads like an attribute access and behaves like a network call.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            The cost is linear in a number that only grows in production. Drag the slider.
          </p>
        </div>

        <div data-animate>
          <NPlusOneDemo />
        </div>

        <p data-animate className="text-xs text-muted-foreground/70 mt-4 leading-relaxed">
          Timings are modelled from a fixed per-query round-trip, not measured against a live
          database — the shape of the curve is the point, not the absolute numbers.
        </p>

        <div data-animate className="mt-10 flex flex-col gap-4">
          <p className="text-muted-foreground leading-relaxed">
            The fix is old news. What's worth internalising is the failure mode:{' '}
            <span className="text-foreground font-medium">
              the bug is invisible at the size you develop at
            </span>
            . You don't catch this class of problem by reading code more carefully — you catch it by
            asserting on query counts in tests, so the regression fails at review time instead of at
            2am.
          </p>
          <pre className="card-solid rounded-xl p-5 text-xs font-mono leading-relaxed overflow-x-auto text-foreground/80">
{`def test_route_list_is_constant_query(client):
    with assertNumQueries(2):
        client.get("/api/routes/")`}
          </pre>
        </div>
      </div>
    </section>
  );
}
