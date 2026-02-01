import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download, Mail, Briefcase, Database, LayoutDashboard, Code2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const headlineWords = ['Building', 'Scalable', 'Solutions', 'for the', 'Future'];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const illustrationRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline word reveal
      const tl = gsap.timeline({ delay: 0.4 });

      wordsRef.current.forEach((word, i) => {
        if (word) {
          tl.fromTo(
            word,
            { 
              clipPath: 'inset(0 100% 0 0)',
              opacity: 0 
            },
            { 
              clipPath: 'inset(0 0% 0 0)',
              opacity: 1,
              duration: i === 2 ? 0.7 : 0.5,
              ease: 'expo.out'
            },
            0.4 + i * 0.12
          );
        }
      });

      // Subheadline
      tl.fromTo(
        subheadlineRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out' },
        1
      );

      // CTA buttons
      tl.fromTo(
        ctaRef.current?.children || [],
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)', stagger: 0.1 },
        1.2
      );

      // Illustration 3D entrance
      tl.fromTo(
        illustrationRef.current,
        { rotateY: 15, x: 100, opacity: 0 },
        { rotateY: 0, x: 0, opacity: 1, duration: 1, ease: 'expo.out' },
        0.6
      );

      // Stats stagger
      tl.fromTo(
        statsRef.current?.children || [],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'expo.out', stagger: 0.08 },
        1.5
      );

      return () => {
        // No scroll triggers
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Generate floating particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 8 + 4,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 15,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.4 + 0.2,
  }));

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-brand-bg-gray via-white to-brand-cream dark:from-brand-black dark:via-brand-dark-gray dark:to-brand-black transition-colors duration-300"
    >
      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-brand-yellow/20 animate-float" />
        <div className="absolute top-40 right-20 w-16 h-16 rounded-xl bg-brand-cyan/30 animate-float-delayed" />
        <div className="absolute bottom-40 left-20 w-12 h-12 rounded-lg bg-brand-pink/20 animate-float" />
        <div className="absolute bottom-20 right-40 w-24 h-24 rounded-full bg-brand-primary/5 animate-float-delayed" />
      </div>

      {/* Particle system */}
      <div ref={particlesRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-brand-primary"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              opacity: p.opacity,
              animation: `float ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Content */}
          <div ref={contentRef} className="relative z-10">
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-brand-black dark:text-white leading-relaxed mb-8 transition-colors">
              {headlineWords.map((word, i) => (
                <span
                  key={i}
                  ref={(el) => { wordsRef.current[i] = el; }}
                  className={`inline-block mr-3 pb-2 ${
                    i === 2 ? 'text-brand-primary' : ''
                  }`}
                >
                  {word}
                </span>
              ))}
            </h1>

            {/* Subheadline */}
            <p
              ref={subheadlineRef}
              className="text-lg sm:text-xl text-brand-medium-gray dark:text-brand-light-gray max-w-xl mb-8 leading-relaxed transition-colors"
            >
              Software Engineer specializing in Django, React, and cloud-native architectures. 
              Delivering high-performance applications for enterprise sectors.
            </p>

            {/* CTA Buttons */}
            <div ref={ctaRef} className="flex flex-wrap gap-4 mb-10">
              <a
                href="/Yousef_Resume.pdf"
                download="Yousef_Resume.pdf"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-primary text-white font-medium rounded-xl hover:bg-brand-dark hover:-translate-y-1 hover:shadow-glow-lg transition-all duration-300"
              >
                Download Resume
                <Download size={18} />
              </a>
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, '#contact')}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-brand-dark-gray text-brand-primary font-medium rounded-xl border-2 border-brand-primary/20 hover:border-brand-primary hover:bg-brand-primary/5 hover:-translate-y-1 transition-all duration-300"
              >
                <Mail size={18} />
                Get in Touch
              </a>
            </div>

            <div ref={statsRef} className="flex flex-wrap gap-6 lg:gap-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand-yellow/30 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-brand-dark dark:text-brand-yellow" />
                </div>
                <div>
                  <p className="text-2xl font-serif font-bold text-brand-black dark:text-white">4+</p>
                  <p className="text-sm text-brand-medium-gray dark:text-brand-light-gray">Years Experience</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand-cyan/40 flex items-center justify-center">
                  <Database className="w-5 h-5 text-brand-dark dark:text-brand-cyan" />
                </div>
                <div>
                  <p className="text-2xl font-serif font-bold text-brand-black dark:text-white">1M+</p>
                  <p className="text-sm text-brand-medium-gray dark:text-brand-light-gray">Rows Handled</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand-pink/30 flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-brand-dark dark:text-brand-pink" />
                </div>
                <div>
                  <p className="text-2xl font-serif font-bold text-brand-black dark:text-white">20+</p>
                  <p className="text-sm text-brand-medium-gray dark:text-brand-light-gray">Dashboards Built</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand-gray/30 flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-brand-dark dark:text-brand-pink" />
                </div>
                <div>
                  <p className="text-2xl font-serif font-bold text-brand-black dark:text-white">50+</p>
                  <p className="text-sm text-brand-medium-gray dark:text-brand-light-gray">APIs Developed</p>
                </div>
              </div>

            </div>
          </div>

          {/* Illustration */}
          <div
            ref={illustrationRef}
            className="relative perspective-1000"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="relative">
              <img
                src="/hero-illustration.jpg"
                alt="Software Engineer Working"
                className="w-full max-w-lg mx-auto rounded-3xl shadow-large hover:scale-[1.02] hover:brightness-105 transition-all duration-500"
                style={{ transform: 'translateZ(50px)' }}
              />
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-brand-primary/10 blur-3xl -z-10 animate-pulse-glow" />
            </div>

            {/* Floating tech badges */}
            <div className="absolute -left-4 top-1/4 px-4 py-2 bg-white dark:bg-brand-dark-gray rounded-xl shadow-card animate-float">
              <span className="text-sm font-medium text-brand-primary">Django</span>
            </div>
            <div className="absolute -right-4 top-1/3 px-4 py-2 bg-white dark:bg-brand-dark-gray rounded-xl shadow-card animate-float-delayed">
              <span className="text-sm font-medium text-brand-accent">React</span>
            </div>
            <div className="absolute left-1/4 -bottom-4 px-4 py-2 bg-white dark:bg-brand-dark-gray rounded-xl shadow-card animate-float">
              <span className="text-sm font-medium text-brand-dark dark:text-white">PostgreSQL</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
