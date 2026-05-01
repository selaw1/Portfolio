import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const skills = [
  { name: 'Python',         category: 'Language'  },
  { name: 'JavaScript',     category: 'Language'  },
  { name: 'TypeScript',     category: 'Language'  },
  { name: 'HTML',           category: 'Language'  },
  { name: 'CSS',            category: 'Language'  },
  { name: 'SCSS',           category: 'Language'  },
  { name: 'Django',         category: 'Framework' },
  { name: 'Django Ninja',   category: 'Framework' },
  { name: 'React',          category: 'Framework' },
  { name: 'Next.js',        category: 'Framework' },
  { name: 'Vite',           category: 'Framework' },
  { name: 'Astro',          category: 'Framework' },
  { name: 'PostgreSQL',     category: 'Database'  },
  { name: 'TimescaleDB',    category: 'Database'  },
  { name: 'MinIO',          category: 'Tools'     },
  { name: 'Celery',         category: 'Tools'     },
  { name: 'RabbitMQ',       category: 'Tools'     },
  { name: 'LavinMQ',        category: 'Tools'     },
  { name: 'Zustand',        category: 'Tools'     },
  { name: 'TanStack Query', category: 'Tools'     },
  { name: 'Sentry',         category: 'Tools'     },
  { name: 'Git',            category: 'Tools'     },
  { name: 'Tailwind CSS',   category: 'UI'        },
  { name: 'shadcn/ui',      category: 'UI'        },
  { name: 'DaisyUI',        category: 'UI'        },
  { name: 'Bootstrap',      category: 'UI'        },
  { name: 'Linux (Arch)',   category: 'OS'        },
];

const ALL = 'All';
const categories = [ALL, ...Array.from(new Set(skills.map((s) => s.category)))];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(ALL);

  const visible = active === ALL ? skills : skills.filter((s) => s.category === active);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          const els = sectionRef.current?.querySelectorAll('[data-animate]') ?? [];
          gsap.fromTo(Array.from(els),
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.05 }
          );
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Re-animate tags on category change
  useEffect(() => {
    if (!tagsRef.current) return;
    const tags = tagsRef.current.querySelectorAll('[data-tag]');
    gsap.fromTo(Array.from(tags),
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out', stagger: 0.02 }
    );
  }, [active]);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-28 lg:py-36 bg-secondary/30"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        {/* Label */}
        <p data-animate className="font-mono text-xs text-muted-foreground mb-4 tracking-widest uppercase">
          <span className="text-primary">//</span> skills
        </p>

        {/* Headline */}
        <h2
          data-animate
          className="font-display font-bold text-foreground mb-10"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.025em' }}
        >
          Technologies I work with
        </h2>

        {/* Category filter */}
        <div data-animate className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filter skills by category">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer focus-ring ${
                active === cat
                  ? 'bg-primary/15 text-primary border-primary/40'
                  : 'bg-transparent text-muted-foreground border-border hover:border-primary/30 hover:text-foreground'
              }`}
              aria-pressed={active === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tag cloud */}
        <div ref={tagsRef} className="flex flex-wrap gap-2">
          {visible.map((skill) => (
            <span key={skill.name} data-tag className="tag cursor-default">
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
