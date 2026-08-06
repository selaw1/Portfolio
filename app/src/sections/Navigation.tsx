import { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import gsap from 'gsap';
import { useTheme } from '../contexts/ThemeContext';

const navLinks = [
  { label: 'about', href: '#about' },
  { label: 'skills', href: '#skills' },
  { label: 'experience', href: '#experience' },
  { label: 'projects', href: '#projects' },
  { label: 'notes', href: '/notes' },
  { label: 'contact', href: '#contact' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const mobileLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const onHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(logoRef.current,
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out', delay: 0.15 }
      );
      linksRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', delay: 0.2 + i * 0.04 }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  // Close the menu, restore scroll, and wire up Escape while it's open.
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    const ctx = gsap.context(() => {
      mobileLinksRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, x: -24 },
          { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out', delay: 0.05 + i * 0.06 }
        );
      });
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
      ctx.revert();
    };
  }, [isMobileMenuOpen]);

  // Anchors scroll in place on the homepage and route back to it from anywhere else.
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMobileMenuOpen(false);
    if (!href.startsWith('#')) return;

    e.preventDefault();
    if (onHome) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/${href}`);
    }
  };

  const linkTarget = (href: string) => (href.startsWith('#') ? (onHome ? href : `/${href}`) : href);

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || !onHome ? 'nav-blur border-b border-border' : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16">
          <Link
            ref={logoRef}
            to="/"
            aria-label="Yousef Selawi — home"
            className="flex items-center focus-ring rounded-md cursor-pointer"
          >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 border border-primary/25 text-primary text-sm font-bold font-display tracking-tight">
              YS
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                ref={(el) => { linksRef.current[i] = el; }}
                to={linkTarget(link.href)}
                onClick={(e) => handleNav(e, link.href)}
                className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 group focus-ring rounded cursor-pointer"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}

            <ThemeToggle onToggle={toggleTheme} />
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle onToggle={toggleTheme} />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors focus-ring cursor-pointer"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex flex-col">
          <div
            className="absolute inset-0 bg-background/95 backdrop-blur-xl"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative z-10 flex flex-col justify-center items-start px-10 h-full gap-2 mt-16">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                ref={(el) => { mobileLinksRef.current[i] = el; }}
                to={linkTarget(link.href)}
                onClick={(e) => handleNav(e, link.href)}
                className="text-4xl font-display font-semibold text-foreground/70 hover:text-primary transition-colors duration-200 py-2 cursor-pointer focus-ring rounded"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/**
 * The icon is driven by the `dark` class rather than React state, so the
 * prerendered markup is identical whichever theme the visitor lands in.
 */
function ThemeToggle({ onToggle }: { onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-200 focus-ring cursor-pointer"
      aria-label="Toggle colour theme"
    >
      <Sun className="w-4 h-4 hidden dark:block" aria-hidden="true" />
      <Moon className="w-4 h-4 block dark:hidden" aria-hidden="true" />
    </button>
  );
}
