import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Database, LayoutDashboard, Code2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { icon: Calendar, value: 4, suffix: '+', label: 'Years Experience' },
  { icon: Database, value: 1, suffix: 'M+', label: 'Rows Handled' },
  { icon: LayoutDashboard, value: 20, suffix: '+', label: 'Dashboards Built' },
  { icon: Code2, value: 50, suffix: '+', label: 'APIs Developed' },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const paragraphsRef = useRef<(HTMLParagraphElement | null)[]>([]);
  const illustrationRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const statValuesRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTriggers: ScrollTrigger[] = [];

      // Section label
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

      // Headline words
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
                { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out', stagger: 0.08 }
              );
            }
          },
          once: true
        })
      );

      // Paragraphs
      paragraphsRef.current.forEach((p, i) => {
        if (p) {
          scrollTriggers.push(
            ScrollTrigger.create({
              trigger: p,
              start: 'top 85%',
              onEnter: () => {
                gsap.fromTo(
                  p,
                  { y: 30, opacity: 0 },
                  { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out', delay: i * 0.15 }
                );
              },
              once: true
            })
          );
        }
      });

      // Illustration
      scrollTriggers.push(
        ScrollTrigger.create({
          trigger: illustrationRef.current,
          start: 'top 80%',
          onEnter: () => {
            gsap.fromTo(
              illustrationRef.current,
              { scale: 0.9, rotate: -3, opacity: 0 },
              { scale: 1, rotate: 0, opacity: 1, duration: 0.8, ease: 'expo.out' }
            );
          },
          once: true
        })
      );

      // Stats with counter animation
      scrollTriggers.push(
        ScrollTrigger.create({
          trigger: statsRef.current,
          start: 'top 85%',
          onEnter: () => {
            statValuesRef.current.forEach((statEl, i) => {
              if (statEl) {
                const targetValue = stats[i].value;
                gsap.fromTo(
                  statEl,
                  { opacity: 0 },
                  { 
                    opacity: 1, 
                    duration: 0.5, 
                    delay: i * 0.1,
                    onStart: () => {
                      gsap.to({ val: 0 }, {
                        val: targetValue,
                        duration: 1,
                        delay: i * 0.1,
                        ease: 'expo.out',
                        onUpdate: function() {
                          if (statEl) {
                            statEl.textContent = Math.round(this.targets()[0].val).toString();
                          }
                        }
                      });
                    }
                  }
                );
              }
            });
          },
          once: true
        })
      );

      // Parallax effect
      scrollTriggers.push(
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            if (illustrationRef.current) {
              gsap.set(illustrationRef.current, { y: 50 - 100 * progress });
            }
          }
        })
      );

      return () => {
        scrollTriggers.forEach(st => st.kill());
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const headlineWords = ['Passionate', 'About', 'Building', 'Impactful', 'Technology'];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-white dark:bg-brand-black overflow-hidden transition-colors"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-cream/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-cyan/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Illustration */}
          <div ref={illustrationRef} className="relative order-2 lg:order-1">
            <div className="relative">
              <img
                src="/about-illustration.jpg"
                alt="About Me"
                className="w-full max-w-md mx-auto rounded-3xl shadow-large"
              />
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 px-4 py-2 bg-brand-yellow/90 rounded-xl shadow-card animate-float">
                <span className="text-sm font-semibold text-brand-dark">Full Stack</span>
              </div>
              <div className="absolute -bottom-4 -left-4 px-4 py-2 bg-brand-primary text-white rounded-xl shadow-card animate-float-delayed">
                <span className="text-sm font-semibold">Problem Solver</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            {/* Section Label */}
            <span
              ref={labelRef}
              className="inline-block text-sm font-semibold text-brand-primary uppercase tracking-widest mb-4"
            >
              About Me
            </span>

            {/* Headline */}
            <h2 ref={headlineRef} className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-brand-black dark:text-white leading-tight mb-6 transition-colors">
              {headlineWords.map((word, i) => (
                <span key={i} className="word inline-block mr-3">
                  {word}
                </span>
              ))}
            </h2>

            {/* Paragraphs - Updated to remove government references */}
            <div className="space-y-4 text-brand-medium-gray dark:text-brand-light-gray leading-relaxed mb-10 transition-colors">
              <p ref={(el) => { paragraphsRef.current[0] = el; }}>
                I&apos;m a Software Engineer with over 4 years of experience architecting robust solutions 
                for enterprise clients. I&apos;ve contributed to large-scale projects 
                handling millions of records with sub-second query performance.
              </p>
              <p ref={(el) => { paragraphsRef.current[1] = el; }}>
                My expertise spans the full stack - from designing dual-database infrastructures with 
                PostgreSQL and TimescaleDB, to building reactive dashboards with React and Zustand. 
                I specialize in asynchronous pipelines, API design, and cloud-native architectures.
              </p>
              <p ref={(el) => { paragraphsRef.current[2] = el; }}>
                Beyond code, I&apos;m driven by the challenge of solving complex problems at scale. 
                Whether it&apos;s optimizing database performance or implementing enterprise-grade security, 
                I bring a meticulous approach to every project.
              </p>
            </div>

            {/* Stats - Updated */}
            <div ref={statsRef} className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="text-center p-4 rounded-2xl bg-brand-bg-gray dark:bg-brand-dark-gray hover:bg-brand-cream/30 transition-colors duration-300 group"
                >
                  <stat.icon className="w-6 h-6 text-brand-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-2xl lg:text-3xl font-serif font-bold text-brand-black dark:text-white">
                    <span ref={(el) => { statValuesRef.current[i] = el; }}>0</span>
                    {stat.suffix}
                  </p>
                  <p className="text-xs text-brand-medium-gray dark:text-brand-light-gray mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
