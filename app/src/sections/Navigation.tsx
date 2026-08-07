import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { AnimatePresence, m, useReducedMotion } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';

const navLinks = [
  { label: 'about', href: '#about' },
  { label: 'work', href: '#work' },
  { label: 'stack', href: '#stack' },
  { label: 'experience', href: '#experience' },
  { label: 'notes', href: '/notes' },
  { label: 'contact', href: '#contact' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const reduced = useReducedMotion();

  const onHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock scroll and wire up Escape while the mobile menu is open.
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isMobileMenuOpen]);

  // Anchors scroll in place on the homepage and route back to it from anywhere else.
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMobileMenuOpen(false);
    if (!href.startsWith('#')) return;

    e.preventDefault();
    if (onHome) {
      document.querySelector(href)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    } else {
      navigate(`/${href}`);
    }
  };

  const linkTarget = (href: string) => (href.startsWith('#') ? (onHome ? href : `/${href}`) : href);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || !onHome ? 'nav-blur border-b border-border' : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16">
          <Link
            to="/"
            aria-label="Yousef Selawi — home"
            className="flex items-center focus-ring rounded-md cursor-pointer"
          >
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 border border-primary/25 text-primary text-sm font-bold font-display tracking-tight transition-colors duration-200 hover:bg-primary/20">
              YS
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={linkTarget(link.href)}
                onClick={(e) => handleNav(e, link.href)}
                className="relative px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 group focus-ring rounded-md cursor-pointer"
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="absolute bottom-1 left-3 right-3 h-px origin-left scale-x-0 bg-primary transition-transform duration-200 group-hover:scale-x-100"
                />
              </Link>
            ))}
            <span aria-hidden="true" className="w-px h-5 bg-border mx-2" />
            <ThemeToggle onToggle={toggleTheme} />
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle onToggle={toggleTheme} />
            <button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors focus-ring cursor-pointer"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <m.div
            className="fixed inset-0 z-40 md:hidden"
            initial={reduced ? undefined : { opacity: 0 }}
            animate={reduced ? undefined : { opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-background/95 backdrop-blur-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative z-10 flex flex-col justify-center items-start px-10 h-full gap-1 mt-16">
              {navLinks.map((link, i) => (
                <m.div
                  key={link.href}
                  initial={reduced ? undefined : { opacity: 0, x: -20 }}
                  animate={reduced ? undefined : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={linkTarget(link.href)}
                    onClick={(e) => handleNav(e, link.href)}
                    className="block text-4xl font-display font-semibold text-foreground/70 hover:text-primary transition-colors duration-200 py-2 cursor-pointer focus-ring rounded"
                  >
                    {link.label}
                  </Link>
                </m.div>
              ))}
            </div>
          </m.div>
        )}
      </AnimatePresence>
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
