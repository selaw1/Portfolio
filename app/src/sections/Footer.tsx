import { Linkedin, Github, Mail } from 'lucide-react';

const socials = [
  { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/yousef-selawi/' },
  { icon: Github, label: 'GitHub', href: 'https://github.com/selaw1' },
  { icon: Mail, label: 'Email', href: 'mailto:yousef@selawii.com' },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground font-mono">
          © {new Date().getFullYear()} Yousef Selawi
        </p>

        <div className="flex items-center gap-3">
          {socials.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              aria-label={label}
              className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-md text-muted-foreground hover:text-primary transition-colors duration-200 focus-ring cursor-pointer"
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
