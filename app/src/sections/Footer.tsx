import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Linkedin, Github, Mail, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

const socialLinks = [
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/in/yousef-alselawi' },
  { icon: Github, label: 'GitHub', href: 'https://github.com/selaw1' },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const columnsRef = useRef<(HTMLDivElement | null)[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTriggers: ScrollTrigger[] = [];

      // Logo
      scrollTriggers.push(
        ScrollTrigger.create({
          trigger: footerRef.current,
          start: 'top 90%',
          onEnter: () => {
            gsap.fromTo(
              logoRef.current,
              { scale: 0.9, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.5, ease: 'expo.out' }
            );
          },
          once: true
        })
      );

      // Tagline
      scrollTriggers.push(
        ScrollTrigger.create({
          trigger: taglineRef.current,
          start: 'top 95%',
          onEnter: () => {
            gsap.fromTo(
              taglineRef.current,
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.4, ease: 'expo.out', delay: 0.1 }
            );
          },
          once: true
        })
      );

      // Columns
      columnsRef.current.forEach((col, i) => {
        if (col) {
          scrollTriggers.push(
            ScrollTrigger.create({
              trigger: col,
              start: 'top 95%',
              onEnter: () => {
                const title = col.querySelector('h4');
                const links = col.querySelectorAll('a');
                
                if (title) {
                  gsap.fromTo(
                    title,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.3, ease: 'expo.out', delay: 0.2 + i * 0.1 }
                  );
                }
                
                gsap.fromTo(
                  links,
                  { opacity: 0, y: 10 },
                  { opacity: 1, y: 0, duration: 0.25, ease: 'expo.out', stagger: 0.05, delay: 0.25 + i * 0.1 }
                );
              },
              once: true
            })
          );
        }
      });

      // Bottom bar
      scrollTriggers.push(
        ScrollTrigger.create({
          trigger: bottomRef.current,
          start: 'top 98%',
          onEnter: () => {
            gsap.fromTo(
              bottomRef.current,
              { opacity: 0 },
              { opacity: 1, duration: 0.4, ease: 'smooth', delay: 0.6 }
            );
          },
          once: true
        })
      );

      return () => {
        scrollTriggers.forEach(st => st.kill());
      };
    }, footerRef);

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
    <footer
      ref={footerRef}
      className="relative bg-white dark:bg-brand-black border-t border-brand-gray dark:border-brand-dark-gray transition-colors"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a
              ref={logoRef}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-block text-2xl font-serif font-bold text-brand-black dark:text-white mb-4 hover:text-brand-primary transition-colors"
            >
              Yousef<span className="text-brand-primary">.</span>
            </a>
            <p ref={taglineRef} className="text-brand-medium-gray dark:text-brand-light-gray text-sm leading-relaxed transition-colors">
              Software Engineer building scalable solutions for the future. Specialized in Django, React, and cloud-native architectures.
            </p>
          </div>

          {/* Navigation Column */}
          <div ref={(el) => { columnsRef.current[0] = el; }}>
            <h4 className="text-sm font-semibold text-brand-black dark:text-white uppercase tracking-wider mb-4 transition-colors">
              Navigation
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="text-brand-medium-gray dark:text-brand-light-gray hover:text-brand-primary hover:translate-x-1 transition-all duration-200 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Column */}
          <div ref={(el) => { columnsRef.current[1] = el; }}>
            <h4 className="text-sm font-semibold text-brand-black dark:text-white uppercase tracking-wider mb-4 transition-colors">
              Connect
            </h4>
            <ul className="space-y-3">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-medium-gray dark:text-brand-light-gray hover:text-brand-primary hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="mailto:usefselawi@gmail.com"
                  className="text-brand-medium-gray dark:text-brand-light-gray hover:text-brand-primary hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          ref={bottomRef}
          className="mt-12 pt-8 border-t border-brand-gray dark:border-brand-dark-gray flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <p className="text-sm text-brand-light-gray dark:text-brand-medium-gray transition-colors">
            &copy; {new Date().getFullYear()} Yousef Selawi. All rights reserved.
          </p>
          <p className="text-sm text-brand-light-gray dark:text-brand-medium-gray flex items-center gap-1 transition-colors">
            Built with <Heart className="w-4 h-4 text-brand-pink fill-brand-pink" /> using React
          </p>
        </div>
      </div>
    </footer>
  );
}
