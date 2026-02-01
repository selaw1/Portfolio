import { useEffect, useState, useRef } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import gsap from 'gsap';
import { useTheme } from '../contexts/ThemeContext';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const themeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Entrance animation
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' }
      );

      linksRef.current.forEach((link, i) => {
        if (link) {
          tl.fromTo(
            link,
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.4, ease: 'expo.out' },
            0.1 + i * 0.08
          );
        }
      });

      tl.fromTo(
        themeBtnRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'expo.out' },
        0.5
      );

      tl.fromTo(
        ctaRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' },
        0.6
      );
    });

    return () => ctx.revert();
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass dark:bg-brand-black/90 shadow-soft py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <a
            ref={logoRef}
            href="#"
            className="text-xl font-serif font-bold text-brand-black dark:text-white hover:scale-105 transition-transform duration-200"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Yousef<span className="text-brand-primary">.</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <a
                key={link.label}
                ref={(el) => { linksRef.current[index] = el; }}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="relative text-sm font-medium text-brand-dark-gray dark:text-brand-light-gray hover:text-brand-primary transition-colors duration-250 group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-250 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Right side: Theme toggle + CTA */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              ref={themeBtnRef}
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl bg-brand-bg-gray dark:bg-brand-dark-gray flex items-center justify-center text-brand-dark-gray dark:text-brand-light-gray hover:bg-brand-primary hover:text-white transition-all duration-200"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* CTA Button */}
            <a
              ref={ctaRef}
              href="#contact"
              onClick={(e) => scrollToSection(e, '#contact')}
              className="inline-flex items-center px-5 py-2.5 bg-brand-primary text-white text-sm font-medium rounded-lg hover:bg-brand-dark hover:-translate-y-0.5 hover:shadow-glow transition-all duration-200"
            >
              Let&apos;s Talk
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-brand-dark-gray dark:text-brand-light-gray hover:text-brand-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-400 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute top-20 left-4 right-4 bg-white dark:bg-brand-dark-gray rounded-2xl shadow-large p-6 transition-all duration-400 ${
            isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-lg font-medium text-brand-dark-gray dark:text-brand-light-gray hover:text-brand-primary transition-colors py-2"
              >
                {link.label}
              </a>
            ))}
            
            {/* Theme toggle in mobile menu */}
            <button
              onClick={() => {
                toggleTheme();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 text-lg font-medium text-brand-dark-gray dark:text-brand-light-gray hover:text-brand-primary transition-colors py-2"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>

            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, '#contact')}
              className="mt-4 inline-flex items-center justify-center px-5 py-3 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-dark transition-colors"
            >
              Let&apos;s Talk
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
