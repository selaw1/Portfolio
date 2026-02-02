import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const skills = [
  // Programming Languages
  { name: 'Python', category: 'Language', level: 95 },
  { name: 'JavaScript', category: 'Language', level: 90 },
  { name: 'TypeScript', category: 'Language', level: 90 },
  { name: 'HTML', category: 'Language', level: 95 },
  { name: 'CSS', category: 'Language', level: 90 },
  { name: 'SCSS', category: 'Language', level: 85 },
  
  // Frameworks
  { name: 'Django', category: 'Framework', level: 95 },
  { name: 'Django Ninja', category: 'Framework', level: 90 },
  { name: 'React', category: 'Framework', level: 90 },
  { name: 'Next.js', category: 'Framework', level: 85 },
  { name: 'Vite', category: 'Framework', level: 85 },
  { name: 'Astro', category: 'Framework', level: 75 },
  
  // Databases
  { name: 'PostgreSQL', category: 'Database', level: 90 },
  { name: 'TimescaleDB', category: 'Database', level: 85 },
  
  // Tools & Libraries
  { name: 'MinIO', category: 'Tools', level: 80 },
  { name: 'Celery', category: 'Tools', level: 85 },
  { name: 'RabbitMQ', category: 'Tools', level: 80 },
  { name: 'LavinMQ', category: 'Tools', level: 75 },
  { name: 'Zustand', category: 'Tools', level: 85 },
  { name: 'TanStack Query', category: 'Tools', level: 85 },
  { name: 'Hey API', category: 'Tools', level: 80 },
  { name: 'Sentry', category: 'Tools', level: 80 },
  { name: 'Git', category: 'Tools', level: 90 },
  
  // UI Libraries
  { name: 'Tailwind CSS', category: 'UI', level: 95 },
  { name: 'Shadcn', category: 'UI', level: 90 },
  { name: 'DaisyUI', category: 'UI', level: 85 },
  { name: 'Bootstrap', category: 'UI', level: 85 },
  
  // DevOps & OS
  { name: 'Linux Arch', category: 'OS', level: 85 },
];

const categories = Array.from(new Set(skills.map(s => s.category)));

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const skillsRef = useRef<(HTMLDivElement | null)[]>([]);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredSkills = selectedCategory === 'All' 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTriggers: ScrollTrigger[] = [];

      // Headline
      scrollTriggers.push(
        ScrollTrigger.create({
          trigger: headlineRef.current,
          start: 'top 80%',
          onEnter: () => {
            gsap.fromTo(
              headlineRef.current,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
            );
          },
          once: true
        })
      );

      // Skills with stagger
      skillsRef.current.forEach((skill, i) => {
        if (skill) {
          scrollTriggers.push(
            ScrollTrigger.create({
              trigger: skill,
              start: 'top 90%',
              onEnter: () => {
                gsap.fromTo(
                  skill,
                  { opacity: 0, x: -30 },
                  { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out', delay: i * 0.05 }
                );
              },
              once: true
            })
          );
        }
      });

      // Progress bars animation
      barsRef.current.forEach((bar, i) => {
        if (bar) {
          const skillIndex = skills.findIndex(s => s === filteredSkills[i]);
          scrollTriggers.push(
            ScrollTrigger.create({
              trigger: bar,
              start: 'top 90%',
              onEnter: () => {
                const level = filteredSkills[i].level;
                gsap.fromTo(
                  bar,
                  { width: '0%' },
                  { width: `${level}%`, duration: 1.2, ease: 'power2.out', delay: i * 0.05 }
                );
              },
              once: true
            })
          );
        }
      });

      return () => {
        scrollTriggers.forEach(st => st.kill());
      };
    }, sectionRef);

    return () => ctx.revert();
  }, [filteredSkills]);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-background dark:bg-brand-black overflow-hidden transition-colors"
    >
      {/* Circuit pattern background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 
            ref={headlineRef}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-4"
          >
            Technical <span className="text-primary">Skills</span>
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive toolkit for building modern, scalable applications
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedCategory === 'All'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                : 'bg-card border border-border text-foreground hover:border-primary hover:text-primary'
            }`}
          >
            All
          </button>
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                  : 'bg-card border border-border text-foreground hover:border-primary hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {filteredSkills.map((skill, i) => (
            <div
              key={`${skill.name}-${skill.category}`}
              ref={(el) => { skillsRef.current[i] = el; }}
              className="group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {skill.name}
                </span>
                <span className="text-sm text-muted-foreground">
                  {skill.category}
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  ref={(el) => { barsRef.current[i] = el; }}
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full relative"
                  style={{ width: '0%' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
