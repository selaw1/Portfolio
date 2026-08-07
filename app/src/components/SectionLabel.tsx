import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

/** The `// label` eyebrow that opens every section. */
export default function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <Reveal y={12}>
      <p className="font-mono text-xs text-muted-foreground mb-5 tracking-[0.2em] uppercase">
        <span className="text-primary" aria-hidden="true">//</span> {children}
      </p>
    </Reveal>
  );
}
