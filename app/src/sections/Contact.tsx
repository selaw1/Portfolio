import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, MapPin, ArrowRight, Linkedin, Github } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/in/yousef-alselawi' },
  { icon: Github, label: 'GitHub', href: 'https://github.com/selaw1' },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTriggers: ScrollTrigger[] = [];

      // Headline words clip reveal
      scrollTriggers.push(
        ScrollTrigger.create({
          trigger: headlineRef.current,
          start: 'top 80%',
          onEnter: () => {
            const words = headlineRef.current?.querySelectorAll('.word');
            if (words) {
              words.forEach((word, i) => {
                gsap.fromTo(
                  word,
                  { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
                  { 
                    clipPath: 'inset(0 0% 0 0)', 
                    opacity: 1, 
                    duration: 0.5, 
                    ease: 'expo.out',
                    delay: i * 0.1
                  }
                );
              });
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
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out', delay: 0.7 }
            );
          },
          once: true
        })
      );

      // CTA button
      scrollTriggers.push(
        ScrollTrigger.create({
          trigger: ctaRef.current,
          start: 'top 90%',
          onEnter: () => {
            gsap.fromTo(
              ctaRef.current,
              { scale: 0.9, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)', delay: 1 }
            );
          },
          once: true
        })
      );

      // Location card
      scrollTriggers.push(
        ScrollTrigger.create({
          trigger: locationRef.current,
          start: 'top 90%',
          onEnter: () => {
            gsap.fromTo(
              locationRef.current,
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.4, ease: 'expo.out', delay: 1.2 }
            );
          },
          once: true
        })
      );

      // Social links
      scrollTriggers.push(
        ScrollTrigger.create({
          trigger: socialsRef.current,
          start: 'top 95%',
          onEnter: () => {
            gsap.fromTo(
              socialsRef.current?.children || [],
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.4, ease: 'expo.out', stagger: 0.1, delay: 1.4 }
            );
          },
          once: true
        })
      );

      return () => {
        scrollTriggers.forEach(st => st.kill());
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Generate particles
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 15 + 20,
    opacity: Math.random() * 0.3 + 0.1,
  }));

  const headlineWords = ["Let's", 'Build', 'Something', 'Amazing', 'Together'];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-brand-bg-gray via-white to-brand-cream dark:from-brand-black dark:via-brand-dark-gray dark:to-brand-black transition-colors duration-300"
    >
      {/* Particle Network */}
      <div ref={particlesRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              backgroundColor: p.id % 3 === 0 ? '#0070a0' : p.id % 3 === 1 ? '#2c90c9' : '#cceff6',
              opacity: p.opacity,
              animation: `float ${p.duration}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-24 h-24 bg-brand-yellow/20 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-40 right-20 w-32 h-32 bg-brand-cyan/20 rounded-full blur-xl animate-float-delayed" />
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-brand-primary/10 rounded-full blur-lg animate-float" />
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 relative">
        <div ref={contentRef} className="text-center">
          {/* Headline */}
          <h2 ref={headlineRef} className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold leading-relaxed text-brand-black dark:text-white mb-6 transition-colors">
            {headlineWords.map((word, i) => (
              <span key={i} className="word inline-block mr-3 pb-2 ">
                {word}
              </span>
            ))}
          </h2>

          {/* Subheadline */}
          <p ref={subheadlineRef} className="text-lg sm:text-xl text-brand-medium-gray dark:text-brand-light-gray max-w-2xl mx-auto mb-10 transition-colors">
            I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
          </p>

          {/* CTA Button - Email hidden, just a button */}
          <a
            ref={ctaRef}
            href="mailto:usefselawi@gmail.com"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary hover:bg-brand-dark text-white text-lg font-medium rounded-xl hover:-translate-y-1 hover:shadow-glow-lg transition-all duration-300 animate-pulse-glow"
          >
            <Mail className="w-5 h-5" />
            Get in Touch
            <ArrowRight className="w-5 h-5" />
          </a>

          {/* Location Info - No email or phone displayed */}
          <div  className="mt-12 gap-4 flex flex-col lg:flex-row justify-center">
            <div ref={locationRef} className="flex justify-center">
              <div className="w-52 flex flex-col items-center p-6 bg-white/80 dark:bg-brand-dark-gray/80 backdrop-blur-sm rounded-2xl shadow-soft transition-colors">
                <div className="w-12 h-12 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-xl flex items-center justify-center mb-3 transition-colors">
                  <MapPin className="w-5 h-5 text-brand-primary" />
                </div>
                <p className="text-sm text-brand-medium-gray dark:text-brand-light-gray mb-1 transition-colors">Location</p>
                <p className="text-brand-black dark:text-white font-medium transition-colors">Dubai, UAE</p>
              </div>
            </div>
            <div ref={locationRef} className="flex justify-center">
              <div className="w-52 flex flex-col items-center p-6 bg-white/80 dark:bg-brand-dark-gray/80 backdrop-blur-sm rounded-2xl shadow-soft transition-colors">
                <div className="w-12 h-12 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-xl flex items-center justify-center mb-3 transition-colors">
                  <MapPin className="w-5 h-5 text-brand-primary" />
                </div>
                <p className="text-sm text-brand-medium-gray dark:text-brand-light-gray mb-1 transition-colors">Location</p>
                <p className="text-brand-black dark:text-white font-medium transition-colors">Amman, Jordan</p>
              </div>
            </div>
            <div ref={locationRef} className="flex justify-center">
              <div className="w-52 flex flex-col items-center p-6 bg-white/80 dark:bg-brand-dark-gray/80 backdrop-blur-sm rounded-2xl shadow-soft transition-colors">
                <div className="w-12 h-12 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-xl flex items-center justify-center mb-3 transition-colors">
                  <MapPin className="w-5 h-5 text-brand-primary" />
                </div>
                <p className="text-sm text-brand-medium-gray dark:text-brand-light-gray mb-1 transition-colors">Location</p>
                <p className="text-brand-black dark:text-white font-medium transition-colors">Toronto, Canada</p>
              </div>
            </div>
          </div>
          {/* Social Links */}
          <div ref={socialsRef} className="mt-12 flex justify-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/80 dark:bg-brand-dark-gray/80 backdrop-blur-sm rounded-xl flex items-center justify-center text-brand-medium-gray dark:text-brand-light-gray hover:text-brand-primary dark:hover:text-brand-primary hover:bg-white dark:hover:bg-brand-dark-gray hover:shadow-soft hover:-translate-y-1 hover:scale-110 transition-all duration-200"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
