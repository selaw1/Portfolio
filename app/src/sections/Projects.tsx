import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Terminal, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: 'Harakti',
    description: 'Track workouts, build routines, and monitor your fitness progress — all in one simple and powerful gym tracker.',
    image: '/harakti.png',
    tech: ['Django', 'PostgreSQL', 'Django Ninja', 'React', 'TanStack Query', 'Zustand', 'shadcn/ui'],
    href: 'https://harakti.com',
    featured: true,
  },
  {
    title: 'Minbur',
    description: 'A Skool.com-style community platform enabling creators to monetize content and manage memberships. Features JWT auth, Stripe, and cloud-based file storage.',
    image: '',
    tech: ['Next.js', 'Django Ninja', 'PostgreSQL', 'JWT', 'Stripe', 'MinIO'],
    href: 'https://github.com/MinburTech/MinburBackend',
    featured: false,
  },
];

export default function Projects() {
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
              { opacity: 0, y: 22 },
              { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }
            );
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section id="projects" ref={sectionRef} className="py-28 lg:py-36 bg-secondary/30">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        {/* Label */}
        <p data-animate className="font-mono text-xs text-muted-foreground mb-4 tracking-widest uppercase">
          <span className="text-primary">//</span> projects
        </p>

        {/* Headline */}
        <h2
          data-animate
          className="font-display font-bold text-foreground mb-14"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.025em' }}
        >
          Things I've built
        </h2>

        {/* Featured row */}
        {featured.map((p) => (
          <div key={p.title} data-animate className="group card-solid rounded-2xl overflow-hidden mb-6 hover:border-primary/30 transition-colors duration-200">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image / placeholder */}
              <div className="relative bg-secondary/60 h-56 md:h-auto overflow-hidden">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Terminal className="w-16 h-16 text-primary/20" aria-hidden="true" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <div className="inline-flex mb-4">
                    <span className="tag tag-accent">Featured</span>
                  </div>
                  <h3 className="font-display font-bold text-foreground text-2xl mb-3 group-hover:text-primary transition-colors duration-200">
                    {p.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    {p.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {p.tech.map((t) => <span key={t} className="tag">{t}</span>)}
                  </div>
                </div>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline focus-ring rounded cursor-pointer"
                  aria-label={`Visit ${p.title}`}
                >
                  View project <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        ))}

        {/* Other projects grid */}
        {rest.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {rest.map((p) => (
              <div key={p.title} data-animate className="group card-solid rounded-2xl overflow-hidden hover:border-primary/30 transition-colors duration-200">
                {/* Image / placeholder */}
                <div className="relative bg-secondary/60 h-44 overflow-hidden">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Terminal className="w-12 h-12 text-primary/20" aria-hidden="true" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display font-bold text-foreground text-xl mb-2 group-hover:text-primary transition-colors duration-200">
                    {p.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {p.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {p.tech.map((t) => <span key={t} className="tag">{t}</span>)}
                  </div>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline focus-ring rounded cursor-pointer"
                    aria-label={`Visit ${p.title}`}
                  >
                    View project <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
