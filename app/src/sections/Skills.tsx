import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Code2, 
  Layers, 
  Database, 
  Wrench,
  FileCode,
  Globe,
  Braces,
  Server,
  Cpu,
  HardDrive,
  Cloud,
  GitBranch,
  Bug,
  Store,
  Component,
  Palette
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const skillCategories = [
  {
    title: 'Languages',
    icon: Code2,
    color: 'bg-brand-yellow/30',
    skills: [
      { name: 'Python', icon: FileCode },
      { name: 'JavaScript', icon: Globe },
      { name: 'TypeScript', icon: Braces },
    ],
  },
  {
    title: 'Frameworks',
    icon: Layers,
    color: 'bg-brand-cyan/40',
    skills: [
      { name: 'Django', icon: Server },
      { name: 'Django Ninja', icon: Cpu },
      { name: 'React', icon: Component },
      { name: 'Next.js', icon: Layers },
    ],
  },
  {
    title: 'Databases',
    icon: Database,
    color: 'bg-brand-pink/30',
    skills: [
      { name: 'PostgreSQL', icon: Database },
      { name: 'TimescaleDB', icon: HardDrive },
    ],
  },
  {
    title: 'Tools & Infrastructure',
    icon: Wrench,
    color: 'bg-brand-cream/50',
    skills: [
      { name: 'MinIO', icon: Cloud },
      { name: 'Celery', icon: Cpu },
      { name: 'RabbitMQ', icon: Server },
      { name: 'Docker', icon: Cloud },
      { name: 'Git', icon: GitBranch },
      { name: 'Sentry', icon: Bug },
      { name: 'Zustand', icon: Store },
      { name: 'TanStack', icon: Component },
      { name: 'Tailwind', icon: Palette },
      { name: 'shadcn/ui', icon: Component },
    ],
  },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const tagsRef = useRef<(HTMLSpanElement | null)[][]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTriggers: ScrollTrigger[] = [];

      // Label
      scrollTriggers.push(
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 80%',
          onEnter: () => {
            gsap.fromTo(
              labelRef.current,
              { opacity: 0, letterSpacing: '0.2em' },
              { opacity: 1, letterSpacing: '0.1em', duration: 0.4, ease: 'expo.out' }
            );
          },
          once: true
        })
      );

      // Headline
      scrollTriggers.push(
        ScrollTrigger.create({
          trigger: headlineRef.current,
          start: 'top 80%',
          onEnter: () => {
            const words = headlineRef.current?.querySelectorAll('.word');
            if (words) {
              gsap.fromTo(
                words,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out', stagger: 0.1 }
              );
            }
          },
          once: true
        })
      );

      // Subheadline
      scrollTriggers.push(
        ScrollTrigger.create({
          trigger: subheadlineRef.current,
          start: 'top 85%',
          onEnter: () => {
            gsap.fromTo(
              subheadlineRef.current,
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out' }
            );
          },
          once: true
        })
      );

      // Category cards with 3D flip
      cardsRef.current.forEach((card, i) => {
        if (card) {
          scrollTriggers.push(
            ScrollTrigger.create({
              trigger: card,
              start: 'top 85%',
              onEnter: () => {
                gsap.fromTo(
                  card,
                  { rotateY: -90, opacity: 0 },
                  { rotateY: 0, opacity: 1, duration: 0.7, ease: 'expo.out', delay: i * 0.15 }
                );
              },
              once: true
            })
          );
        }
      });

      // Skill tags stagger
      tagsRef.current.forEach((categoryTags, catIndex) => {
        categoryTags.forEach((tag, tagIndex) => {
          if (tag) {
            scrollTriggers.push(
              ScrollTrigger.create({
                trigger: cardsRef.current[catIndex],
                start: 'top 80%',
                onEnter: () => {
                  gsap.fromTo(
                    tag,
                    { scale: 0, opacity: 0 },
                    { 
                      scale: 1, 
                      opacity: 1, 
                      duration: 0.3, 
                      ease: 'elastic.out(1, 0.5)',
                      delay: 0.9 + catIndex * 0.15 + tagIndex * 0.04
                    }
                  );
                },
                once: true
              })
            );
          }
        });
      });

      return () => {
        scrollTriggers.forEach(st => st.kill());
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const headlineWords = ['Skills', '&', 'Technologies'];

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-brand-bg-gray dark:bg-brand-dark-gray overflow-hidden transition-colors"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-brand-primary/5 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-brand-cyan/20 rounded-full blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <span
            ref={labelRef}
            className="inline-block text-sm font-semibold text-brand-primary uppercase tracking-widest mb-4"
          >
            Technical Expertise
          </span>
          <h2 ref={headlineRef} className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-brand-black dark:text-white mb-4 transition-colors">
            {headlineWords.map((word, i) => (
              <span key={i} className="word inline-block mr-3">
                {word}
              </span>
            ))}
          </h2>
          <p ref={subheadlineRef} className="text-lg text-brand-medium-gray dark:text-brand-light-gray max-w-2xl mx-auto transition-colors">
            A comprehensive toolkit built through years of building production-grade applications
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 perspective-1000">
          {skillCategories.map((category, catIndex) => (
            <div
              key={category.title}
              ref={(el) => { cardsRef.current[catIndex] = el; }}
              className="group bg-white dark:bg-brand-black rounded-2xl p-6 shadow-card hover:shadow-card-hover hover:-translate-y-2 transition-all duration-300 preserve-3d"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Category Header */}
              <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <category.icon className="w-6 h-6 text-brand-dark dark:text-white" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-brand-black dark:text-white mb-4 transition-colors">
                {category.title}
              </h3>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <span
                    key={skill.name}
                    ref={(el) => {
                      if (!tagsRef.current[catIndex]) tagsRef.current[catIndex] = [];
                      tagsRef.current[catIndex][skillIndex] = el;
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-bg-gray dark:bg-brand-dark-gray text-brand-dark-gray dark:text-brand-light-gray text-sm font-medium rounded-lg hover:bg-brand-primary hover:text-white hover:scale-105 transition-all duration-200 cursor-default"
                  >
                    <skill.icon className="w-3.5 h-3.5" />
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
