import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Linkedin, Github, Send, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/yousef-selawi/', color: 'hover:text-[#0077b5]' },
  { icon: Github, label: 'GitHub', href: 'https://github.com/selaw1', color: 'hover:text-foreground' },
  { icon: Mail, label: 'Email', href: 'mailto:yousef@selawii.com', color: 'hover:text-primary' },
];


export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTriggers: ScrollTrigger[] = [];

      // Headline
      scrollTriggers.push(
        ScrollTrigger.create({
          trigger: headlineRef.current,
          start: 'top 80%',
          onEnter: () => {
            gsap.fromTo(
              headlineRef.current,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
            );
          },
          once: true
        })
      );

      // Cards stagger
      cardsRef.current.forEach((card, i) => {
        if (card) {
          scrollTriggers.push(
            ScrollTrigger.create({
              trigger: card,
              start: 'top 90%',
              onEnter: () => {
                gsap.fromTo(
                  card,
                  { opacity: 0, y: 30, scale: 0.9 },
                  { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)', delay: i * 0.1 }
                );
              },
              once: true
            })
          );
        }
      });

      return () => {
        scrollTriggers.forEach(st => st.kill());
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden bg-secondary/50 dark:bg-brand-black transition-colors"
    >
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-12 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 
            ref={headlineRef}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-4"
          >
            Let's <span className="text-primary">Connect</span>
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? I'd love to hear from you.
          </p>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {socialLinks.map((social, i) => {
            const Icon = social.icon;
            return (
              <a
                key={i}
                ref={(el) => { cardsRef.current[i] = el; }}
                href={social.href}
                target={social.href.startsWith('http') ? '_blank' : undefined}
                rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`group relative p-8 bg-card border border-border rounded-2xl hover:border-primary/50 hover:shadow-lg transition-all duration-300 text-center ${social.color}`}
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{social.label}</h3>
                <p className="text-sm text-muted-foreground">Connect with me</p>
                
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              </a>
            );
          })}
        </div>

        {/* Direct Email CTA */}
        <div className="text-center">
          <a
            href="mailto:yousef@selawii.com"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/50 hover:-translate-y-1 transition-all duration-300"
          >
            <Send className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Send Me an Email
          </a>
        </div>

        {/* Location Badge */}
        <div className="mt-12 flex items-center justify-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">Based in Dubai, UAE</span>
        </div>
      </div>
    </section>
  );
}
