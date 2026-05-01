import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight, FileText } from 'lucide-react';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = contentRef.current?.querySelectorAll('[data-enter]') ?? [];
      gsap.fromTo(
        Array.from(els),
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: 'power3.out',
          stagger: 0.07,
          delay: 0.25,
        }
      );

      gsap.fromTo(
        terminalRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.55 }
      );
    });
    return () => ctx.revert();
  }, []);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center bg-background overflow-hidden"
    >
      {/* Radial glow — purely decorative, pointer-events none */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 py-28 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — content */}
          <div ref={contentRef} className="flex flex-col gap-6">
            {/* Status badge */}
            <div data-enter className="inline-flex items-center gap-2 self-start">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium font-mono text-muted-foreground uppercase tracking-widest">
                Available for work
              </span>
            </div>

            {/* Name */}
            <h1
              data-enter
              className="font-display font-bold text-foreground leading-none"
              style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', letterSpacing: '-0.03em' }}
            >
              Yousef<br />
              <span className="gradient-text">Selawi</span>
            </h1>

            {/* Role */}
            <p
              data-enter
              className="text-muted-foreground font-mono text-sm"
            >
              <span className="text-primary">›</span>&nbsp;Software Engineer — Full-Stack
            </p>

            {/* Bio */}
            <p data-enter className="text-muted-foreground leading-relaxed max-w-md">
              I build performant web applications and data systems.{' '}
              Crafting products used by thousands every day.
            </p>

            {/* CTAs */}
            <div data-enter className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#contact"
                onClick={(e) => scrollTo(e, '#contact')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity duration-200 focus-ring cursor-pointer min-h-[44px]"
              >
                Get in touch <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/Yousef_Resume.pdf"
                download
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md card-solid text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors duration-200 focus-ring cursor-pointer min-h-[44px]"
              >
                <FileText className="w-4 h-4" /> Resume
              </a>
            </div>
          </div>

          {/* Right — fake terminal */}
          <div
            ref={terminalRef}
            className="card-solid rounded-xl overflow-hidden shadow-card lg:block"
            aria-label="Code snippet example"
            aria-hidden="true"
          >
            {/* Terminal title bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/30">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
              <span className="ml-3 text-xs font-mono text-muted-foreground">api/views.py</span>
            </div>

            {/* Code body */}
            <pre className="p-6 text-xs font-mono leading-relaxed overflow-x-auto text-foreground/70">
<span className="text-primary/70">from</span> <span className="text-emerald-400/80">django.db.models</span> <span className="text-primary/70">import</span> Prefetch{'\n'}
<span className="text-primary/70">from</span> <span className="text-emerald-400/80">rest_framework.views</span> <span className="text-primary/70">import</span> APIView{'\n'}
{'\n'}
<span className="text-muted-foreground"># ── Harakti real-time route API ──────────────────</span>{'\n'}
<span className="text-yellow-400/80">class</span> <span className="text-emerald-400/80">RouteDetailView</span>(APIView):{'\n'}
{'    '}<span className="text-yellow-400/80">def</span> <span className="text-primary/90">get</span>(<span className="text-yellow-400/80">self</span>, request, pk):{'\n'}
{'        '}route = Route.objects.prefetch_related({'\n'}
{'            '}Prefetch(<span className="text-green-400/90">'stops'</span>,{'\n'}
{'                    '}queryset=Stop.objects.order_by(<span className="text-green-400/90">'sequence'</span>)){'\n'}
{'        '}).get(pk=pk){'\n'}
{'        '}<span className="text-muted-foreground"># serialize &amp; return optimised payload</span>{'\n'}
{'        '}serializer = RouteSerializer(route){'\n'}
{'        '}<span className="text-primary/70">return</span> Response(serializer.data){'\n'}
<span className="text-muted-foreground">{'\n'}# currently @ Kalvad · Dubai</span>{'\n'}
<span className="text-muted-foreground"># 1M+ rows served daily</span>
            </pre>

            {/* Blinking cursor line */}
            <div className="px-6 pb-5 font-mono text-xs text-muted-foreground/50 flex items-center gap-1">
              <span className="text-primary/60">❯</span>
              <span className="animate-cursor inline-block w-[6px] h-[14px] bg-primary/40 rounded-sm" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
