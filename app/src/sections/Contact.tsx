import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Linkedin, Github, Mail, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const socials = [
  { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/yousef-selawi/' },
  { icon: Github, label: 'GitHub', href: 'https://github.com/selaw1' },
  { icon: Mail, label: 'Email', href: 'mailto:yousef@selawii.com' },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = sectionRef.current?.querySelectorAll('[data-animate]') ?? [];
      els.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: () => {
            gsap.fromTo(el,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', delay: i * 0.06 }
            );
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="py-28 lg:py-36 bg-background">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 text-center">

        {/* Label */}
        <p data-animate className="font-mono text-xs text-muted-foreground mb-4 tracking-widest uppercase">
          <span className="text-primary">//</span> contact
        </p>

        {/* Headline */}
        <h2
          data-animate
          className="font-display font-bold text-foreground mb-6"
          style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', letterSpacing: '-0.025em' }}
        >
          Let's work together
        </h2>

        <p data-animate className="text-muted-foreground max-w-md mx-auto mb-12 leading-relaxed">
          Got a project, a question, or just want to say hi? My inbox is always open.
        </p>

        {/* Giant email CTA */}
        <a
          data-animate
          href="mailto:yousef@selawii.com"
          className="inline-block font-display font-bold text-primary hover:text-primary/80 transition-colors duration-200 focus-ring rounded cursor-pointer mb-14"
          style={{ fontSize: 'clamp(1.4rem, 4vw, 2.8rem)', letterSpacing: '-0.02em' }}
          aria-label="Send an email to yousef@selawii.com"
        >
          yousef@selawii.com
        </a>

        {/* Social row */}
        <div data-animate className="flex items-center justify-center gap-4 mb-12">
          {socials.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              aria-label={label}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md card-solid text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors duration-200 focus-ring cursor-pointer"
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
            </a>
          ))}
        </div>

        {/* Location */}
        <div data-animate className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground border border-border rounded-full px-4 py-2">
          <MapPin className="w-3 h-3 text-primary" aria-hidden="true" />
          Dubai, UAE
        </div>
      </div>
    </section>
  );
}
