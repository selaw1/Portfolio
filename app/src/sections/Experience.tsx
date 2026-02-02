import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Calendar, Briefcase } from 'lucide-react';

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
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const descriptionsRef = useRef<(HTMLLIElement | null)[]>([]);

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

      // Card entrance
      scrollTriggers.push(
        ScrollTrigger.create({
          trigger: cardRef.current,
          start: 'top 75%',
          onEnter: () => {
            gsap.fromTo(
              cardRef.current,
              { opacity: 0, y: 50, rotateX: 10 },
              { opacity: 1, y: 0, rotateX: 0, duration: 0.8, ease: 'power3.out' }
            );
          },
          once: true
        })
      );

      // Description items stagger
      descriptionsRef.current.forEach((item, i) => {
        if (item) {
          scrollTriggers.push(
            ScrollTrigger.create({
              trigger: item,
              start: 'top 90%',
              onEnter: () => {
                gsap.fromTo(
                  item,
                  { opacity: 0, x: -20 },
                  { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', delay: i * 0.1 }
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



  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-secondary/30 dark:bg-brand-black overflow-hidden transition-colors"
    >
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 
            ref={headlineRef}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-4"
          >
            Work <span className="text-primary">Experience</span>
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6" />
          <p className="text-lg text-muted-foreground">
            Building enterprise solutions and scalable systems
          </p>
        </div>

        {/* Experience Card */}
        {experiences.map((exp) => (
          <div
            key={exp.company}
            ref={cardRef}
            className="relative p-8 lg:p-10 bg-card border border-border rounded-2xl hover:border-primary/50 transition-all duration-300"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-foreground">{exp.role}</h3>
                    <p className="text-primary font-semibold">{exp.company}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:items-end text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {exp.location}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4" />
                  {exp.period}
                </div>
              </div>
            </div>

            {/* Description */}
            <ul className="space-y-3 mb-8">
              {exp.description.map((item, i) => (
                <li 
                  key={i} 
                  ref={(el) => { descriptionsRef.current[i] = el; }}
                  className="flex items-start gap-3 text-muted-foreground leading-relaxed"
                >
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Tech Stack */}
            <div className="pt-6 border-t border-border">
              <p className="text-sm font-semibold text-foreground mb-4">Technologies Used:</p>
              <div className="flex flex-wrap gap-2">
                {exp.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-primary/20 rounded-tr-2xl" />
          </div>
        ))}
      </div>
    </section>
  );
}
