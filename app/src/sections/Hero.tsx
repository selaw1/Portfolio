import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Terminal, Code2, Zap, ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const glitchRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      // Glitch title entrance
      tl.fromTo(
        glitchRef.current,
        { opacity: 0, y: 50, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out' }
      );

      // Subtitle
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.5'
      );

      // CTA buttons
      tl.fromTo(
        ctaRef.current?.children || [],
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)', stagger: 0.1 },
        '-=0.3'
      );

      // Grid animation
      if (gridRef.current) {
        const lines = gridRef.current.querySelectorAll('.grid-line');
        gsap.fromTo(
          lines,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.5, ease: 'power2.out', stagger: 0.05, delay: 0.5 }
        );
      }

      // Continuous glitch effect
      const glitchLoop = () => {
        if (glitchRef.current && Math.random() > 0.9) {
          gsap.to(glitchRef.current, {
            x: Math.random() * 4 - 2,
            duration: 0.05,
            repeat: 3,
            yoyo: true,
            onComplete: () => {
              gsap.set(glitchRef.current, { x: 0 });
            }
          });
        }
      };
      
      const interval = setInterval(glitchLoop, 3000);

      return () => {
        clearInterval(interval);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background dark:bg-brand-black transition-colors"
    >
      {/* Animated Grid Background */}
      <div ref={gridRef} className="absolute inset-0 opacity-30 dark:opacity-20">
        {/* Horizontal lines */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`h-${i}`}
            className="grid-line absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
            style={{ top: `${(i + 1) * 8.33}%` }}
          />
        ))}
        {/* Vertical lines */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`v-${i}`}
            className="grid-line absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary to-transparent"
            style={{ left: `${(i + 1) * 5}%` }}
          />
        ))}
      </div>

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 relative z-10">
        <div className="text-center space-y-8">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Fullstack Developer</span>
          </div>

          {/* Main Heading with Glitch Effect */}
          <h1
            ref={glitchRef}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold text-foreground mb-6 relative"
            data-text="Yousef Selawi"
          >
            <span className="text-foreground">Yousef </span>
            <span className="text-primary">Selawi</span>
          </h1>

          {/* Typing Effect Subtitle */}
          <p
            ref={subtitleRef}
            className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground max-w-3xl mx-auto font-mono"
          >
            <Terminal className="inline-block w-6 h-6 mr-2 text-primary" />
            Software Engineer <span className="text-primary">|</span> Full-Stack Developer
          </p>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {['Django', 'React', 'TypeScript', 'PostgreSQL', 'Python'].map((tech, i) => (
              <div
                key={tech}
                className="px-4 py-2 rounded-lg bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-default"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className="text-sm font-medium text-foreground">{tech}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-wrap justify-center gap-4 pt-8">
            <a
              href="/Yousef_Resume.pdf"
              download
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg overflow-hidden hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
            >
              <span className="relative z-10">Download Resume</span>
              <Code2 className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, '#contact')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-card text-foreground font-semibold rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-300"
            >
              Let's Connect
              <Zap className="w-5 h-5" />
            </a>
          </div>

          {/* Scroll Indicator */}
          <a
            href="#about"
            onClick={(e) => scrollToSection(e, '#about')}
            className="inline-block pt-12 text-muted-foreground hover:text-primary transition-colors animate-bounce cursor-pointer"
          >
            <ChevronDown className="w-8 h-8" />
          </a>
        </div>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary/30" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-primary/30" />
    </section>
  );
}
