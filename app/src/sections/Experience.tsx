import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Building2, MapPin, Calendar } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    company: 'Kalvad',
    role: 'Software Engineer',
    location: 'Dubai, UAE',
    period: 'October 2021 - Present',
    description: [
      'Architected dual-database infrastructure using PostgreSQL and TimescaleDB hypertables with continuous aggregates and compression, improving time-series query performance for millions of records',
      'Engineered robust asynchronous pipelines with Celery and RabbitMQ, handling 15+ scheduled jobs for data synchronization, ML model training, and large-scale exports of 1M+ rows',
      'Developed high-performance REST APIs with Django Ninja, JWT authentication, and role-based access control, serving 20+ real-time dashboards',
      'Implemented secure, enterprise-grade authentication and auditing, including 2FA, LDAP/Active Directory, API key management, and field-level audit logs',
      'Optimized database and application performance through indexing, N+1 query elimination, streaming large exports via MinIO',
      'Developed 20+ dynamic, real-time dashboards using React, Zustand, React Query, and Hey API for automatic schema generation',
    ],
    techStack: [
      'Django', 'TimescaleDB', 'PostgreSQL', 'Celery', 'RabbitMQ', 
      'Django Ninja', 'MinIO', 'Docker', 'Sentry', 'JWT', 
      'React', 'TanStack', 'Hey API', 'Zustand'
    ],
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const techTagsRef = useRef<(HTMLSpanElement | null)[]>([]);

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
                { y: 40, opacity: 0 },
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

      // Timeline line draw
      scrollTriggers.push(
        ScrollTrigger.create({
          trigger: timelineRef.current,
          start: 'top 80%',
          onEnter: () => {
            const line = timelineRef.current?.querySelector('.timeline-line');
            if (line) {
              gsap.fromTo(
                line,
                { scaleY: 0, transformOrigin: 'top' },
                { scaleY: 1, duration: 1.5, ease: 'expo.out' }
              );
            }
          },
          once: true
        })
      );

      // Job card
      scrollTriggers.push(
        ScrollTrigger.create({
          trigger: cardRef.current,
          start: 'top 80%',
          onEnter: () => {
            gsap.fromTo(
              cardRef.current,
              { rotateY: 15, x: 100, opacity: 0 },
              { rotateY: 0, x: 0, opacity: 1, duration: 0.7, ease: 'expo.out', delay: 0.3 }
            );

            // Description lines stagger
            const lines = cardRef.current?.querySelectorAll('.desc-line');
            if (lines) {
              gsap.fromTo(
                lines,
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.3, ease: 'expo.out', stagger: 0.06, delay: 0.6 }
              );
            }
          },
          once: true
        })
      );

      // Tech tags
      techTagsRef.current.forEach((tag, i) => {
        if (tag) {
          scrollTriggers.push(
            ScrollTrigger.create({
              trigger: cardRef.current,
              start: 'top 70%',
              onEnter: () => {
                gsap.fromTo(
                  tag,
                  { scale: 0, opacity: 0 },
                  { scale: 1, opacity: 1, duration: 0.25, ease: 'elastic.out(1, 0.5)', delay: 1 + i * 0.03 }
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
  }, []);

  const headlineWords = ['Professional', 'Journey'];

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-white dark:bg-brand-black overflow-hidden transition-colors"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-cream/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-brand-cyan/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-12 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <span
            ref={labelRef}
            className="inline-block text-sm font-semibold text-brand-primary uppercase tracking-widest mb-4"
          >
            Work Experience
          </span>
          <h2 ref={headlineRef} className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-brand-black dark:text-white mb-4 transition-colors">
            {headlineWords.map((word, i) => (
              <span key={i} className="word inline-block mr-3">
                {word}
              </span>
            ))}
          </h2>
          <p ref={subheadlineRef} className="text-lg text-brand-medium-gray dark:text-brand-light-gray transition-colors">
            Building enterprise solutions and scalable systems
          </p>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-primary to-brand-light transform lg:-translate-x-1/2">
            <div className="timeline-line absolute inset-0 bg-gradient-to-b from-brand-primary to-brand-light" />
          </div>

          {/* Experience Cards */}
          {experiences.map((exp, index) => (
            <div key={exp.company} className="relative mb-12">
              {/* Timeline Node */}
              <div className="absolute left-4 lg:left-1/2 top-0 w-4 h-4 bg-brand-primary rounded-full border-4 border-white dark:border-brand-black shadow-md transform -translate-x-1/2 z-10">
                <div className="absolute inset-0 bg-brand-primary rounded-full animate-ping opacity-30" />
              </div>

              {/* Card */}
              <div
                ref={cardRef}
                className="ml-12 lg:ml-0 lg:w-5/6 bg-white dark:bg-brand-dark-gray rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 p-6 lg:p-8 border-l-4 border-transparent hover:border-brand-primary"
                style={{ 
                  marginLeft: index % 2 === 0 ? '0' : 'auto',
                  marginRight: index % 2 === 0 ? 'auto' : '0'
                }}
              >
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-brand-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-serif font-bold text-brand-black dark:text-white">{exp.role}</h3>
                        <p className="text-brand-primary font-medium">{exp.company}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end text-sm text-brand-medium-gray dark:text-brand-light-gray">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {exp.location}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Calendar className="w-4 h-4" />
                      {exp.period}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <ul className="space-y-3 mb-6">
                  {exp.description.map((item, i) => (
                    <li key={i} className="desc-line flex items-start gap-3 text-brand-medium-gray dark:text-brand-light-gray leading-relaxed transition-colors">
                      <span className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Tech Stack */}
                <div className="pt-4 border-t border-brand-gray dark:border-brand-dark-gray">
                  <p className="text-sm font-medium text-brand-dark-gray dark:text-brand-light-gray mb-3 transition-colors">Tech Stack:</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.techStack.map((tech, i) => (
                      <span
                        key={tech}
                        ref={(el) => { techTagsRef.current[i] = el; }}
                        className="px-3 py-1 bg-brand-bg-gray dark:bg-brand-black text-brand-dark-gray dark:text-brand-light-gray text-xs font-medium rounded-lg hover:bg-brand-primary hover:text-white hover:scale-105 transition-all duration-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
