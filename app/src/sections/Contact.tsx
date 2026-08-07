import { Linkedin, Github, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { StarsBackground } from '../components/animate-ui/backgrounds/stars';
import SectionLabel from '../components/SectionLabel';
import ContactForm from '../components/ContactForm';

const EMAIL = 'yousef@selawii.com';

const socials = [
  { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/yousef-selawi/' },
  { icon: Github, label: 'GitHub', href: 'https://github.com/selaw1' },
  { icon: Mail, label: 'Email', href: `mailto:${EMAIL}` },
];

export default function Contact() {
  return (
    <section id="contact" className="relative bg-background overflow-hidden">
      <StarsBackground className="absolute inset-0" speed={90} />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-56 left-1/2 -translate-x-1/2 w-[760px] h-[760px] max-w-[140vw] rounded-full bg-primary/12 blur-[130px]" />
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-background to-transparent" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10 py-32 lg:py-40 text-center">
        <SectionLabel>contact</SectionLabel>

        <Reveal>
          <h2
            className="font-display font-bold text-foreground mb-6"
            style={{ fontSize: 'clamp(2.25rem, 6vw, 4rem)', letterSpacing: '-0.035em' }}
          >
            Let's build something<br />
            <span className="gradient-text">worth maintaining</span>
          </h2>
        </Reveal>

        <Reveal index={1}>
          <p className="text-muted-foreground leading-relaxed max-w-md mx-auto mb-12">
            Got a system that's outgrown its schema, or a product that needs
            building end to end? My inbox is open.
          </p>
        </Reveal>

        <Reveal index={2}>
          <div className="max-w-xl mx-auto mb-10 rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-6 sm:p-8">
            <ContactForm />
          </div>
        </Reveal>

        <Reveal index={2}>
          <p className="text-sm text-muted-foreground mb-10">
            Or just email me at{' '}
            <a
              href={`mailto:${EMAIL}`}
              className="text-primary hover:underline focus-ring rounded inline-flex items-center gap-1"
            >
              {EMAIL}
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </p>
        </Reveal>

        <Reveal index={3}>
          <div className="flex items-center justify-center gap-3 mb-12">
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={label}
                className="inline-flex items-center justify-center w-12 h-12 rounded-xl border border-border bg-card/60 backdrop-blur-sm text-muted-foreground hover:text-primary hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 focus-ring cursor-pointer"
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal index={4}>
          <p className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground border border-border rounded-full px-4 py-2 bg-card/50 backdrop-blur-sm">
            <MapPin className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
            Dubai, UAE · GMT+4
          </p>
        </Reveal>
      </div>
    </section>
  );
}
