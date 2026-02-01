import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: 'Minbur',
    description: 'A Skool.com-style community platform enabling creators to monetize content and manage memberships. Features secure JWT authentication, Stripe integration, and cloud-based file storage.',
    image: '/project-minbur.jpg',
    tech: ['Next.js', 'Django Ninja', 'PostgreSQL', 'JWT', 'Stripe', 'MinIO'],
    links: {
      github: 'https://github.com/MinburTech/MinburBackend',
    },
  },
  {
    title: 'Programming Center Platform',
    description: 'Comprehensive programming education platform with interactive tutorials, built-in code editor, and community-driven Q&A section. Integrated HackerEarth API for code compilation.',
    image: '/project-programming.jpg',
    tech: ['Django', 'PostgreSQL', 'Django MPTT', 'HackerEarth API', 'ACE.js'],
    links: {
      github: 'https://github.com/selaw1/ProgrammingCenter-Platform',
    },
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

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
            gsap.fromTo(
              headlineRef.current,
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out' }
            );
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

      // Project cards with 3D rise
      cardsRef.current.forEach((card, i) => {
        if (card) {
          scrollTriggers.push(
            ScrollTrigger.create({
              trigger: card,
              start: 'top 85%',
              onEnter: () => {
                gsap.fromTo(
                  card,
                  { y: 80, rotateX: 10, opacity: 0 },
                  { y: 0, rotateX: 0, opacity: 1, duration: 0.7, ease: 'expo.out', delay: i * 0.15 }
                );
              },
              once: true
            })
          );

          // Parallax for card image
          scrollTriggers.push(
            ScrollTrigger.create({
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
              onUpdate: (self) => {
                const img = card.querySelector('.project-image');
                if (img) {
                  gsap.set(img, { y: 20 - 40 * self.progress });
                }
              }
            })
          );
        }
      });

      return () => {
        scrollTriggers.forEach(st => st.kill());
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-brand-bg-gray dark:bg-brand-black overflow-hidden transition-colors"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-brand-cyan/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <span
            ref={labelRef}
            className="inline-block text-sm font-semibold text-brand-primary uppercase tracking-widest mb-4"
          >
            Featured Work
          </span>
          <h2 ref={headlineRef} className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-brand-black dark:text-white mb-4 transition-colors">
            Projects
          </h2>
          <p ref={subheadlineRef} className="text-lg text-brand-medium-gray dark:text-brand-light-gray max-w-2xl mx-auto transition-colors">
            A selection of my recent work and personal projects
          </p>
        </div>

        {/* Projects Grid - Updated to 2 columns */}
        <div className="grid md:grid-cols-2 gap-8 perspective-1000 max-w-4xl mx-auto">
          {projects.map((project, index) => (
            <div
              key={project.title}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="group bg-white dark:bg-brand-dark-gray rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-400 preserve-3d"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="project-image w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-brand-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-primary hover:scale-110 hover:-translate-y-1 transition-all duration-200"
                      aria-label="View GitHub"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-serif font-bold text-brand-black dark:text-white mb-2 group-hover:text-brand-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-brand-medium-gray dark:text-brand-light-gray text-sm leading-relaxed mb-4 transition-colors">
                  {project.description}
                </p>
                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 bg-brand-bg-gray dark:bg-brand-black text-brand-dark-gray dark:text-brand-light-gray text-xs font-medium rounded-md transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
