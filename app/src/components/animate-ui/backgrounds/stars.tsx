import * as React from 'react';
import {
  m,
  useMotionValue,
  useSpring,
  useReducedMotion,
  type SpringOptions,
  type Transition,
} from 'motion/react';
import { cn } from '../../../lib/utils';

/**
 * Adapted from animate-ui's Stars background — see ../README.md.
 *
 * Changes from the original: the stars are drawn in the theme's foreground
 * colour rather than hardcoded white, the container is transparent so the
 * page background shows through in both themes, and drift/parallax are
 * disabled under prefers-reduced-motion.
 */

type StarLayerProps = React.ComponentProps<typeof m.div> & {
  count: number;
  size: number;
  transition: Transition;
  starColor: string;
};

function generateStars(count: number, starColor: string) {
  const shadows: string[] = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * 4000) - 2000;
    const y = Math.floor(Math.random() * 4000) - 2000;
    shadows.push(`${x}px ${y}px ${starColor}`);
  }
  return shadows.join(', ');
}

function StarLayer({ count, size, transition, starColor, className, ...props }: StarLayerProps) {
  // Generated after mount so the prerendered markup stays identical to the
  // first client render — random values would otherwise break hydration.
  const [boxShadow, setBoxShadow] = React.useState('');
  React.useEffect(() => {
    setBoxShadow(generateStars(count, starColor));
  }, [count, starColor]);

  return (
    <m.div
      aria-hidden="true"
      animate={{ y: [0, -2000] }}
      transition={transition}
      className={cn('absolute top-0 left-0 w-full h-[2000px]', className)}
      {...props}
    >
      <div
        className="absolute rounded-full bg-transparent"
        style={{ width: size, height: size, boxShadow }}
      />
      <div
        className="absolute top-[2000px] rounded-full bg-transparent"
        style={{ width: size, height: size, boxShadow }}
      />
    </m.div>
  );
}

export type StarsBackgroundProps = React.ComponentProps<'div'> & {
  factor?: number;
  speed?: number;
  transition?: SpringOptions;
  starColor?: string;
};

export function StarsBackground({
  children,
  className,
  factor = 0.04,
  speed = 70,
  transition = { stiffness: 50, damping: 20 },
  starColor = 'hsl(var(--foreground) / 0.85)',
  ...props
}: StarsBackgroundProps) {
  const reduced = useReducedMotion();
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const springX = useSpring(offsetX, transition);
  const springY = useSpring(offsetY, transition);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduced) return;
      offsetX.set(-(e.clientX - window.innerWidth / 2) * factor);
      offsetY.set(-(e.clientY - window.innerHeight / 2) * factor);
    },
    [offsetX, offsetY, factor, reduced]
  );

  const drift = (duration: number): Transition =>
    reduced ? { duration: 0 } : { repeat: Infinity, duration, ease: 'linear' };

  return (
    <div
      className={cn('relative size-full overflow-hidden', className)}
      onMouseMove={handleMouseMove}
      {...props}
    >
      <m.div
        aria-hidden="true"
        style={reduced ? undefined : { x: springX, y: springY }}
        // Dark specks on a light page read as noise, so the light theme gets a
        // much lighter hand than the dark one.
        className="pointer-events-none absolute inset-0 opacity-25 dark:opacity-70"
      >
        <StarLayer count={800} size={1} transition={drift(speed)} starColor={starColor} />
        <StarLayer count={300} size={2} transition={drift(speed * 2)} starColor={starColor} />
        <StarLayer count={120} size={3} transition={drift(speed * 3)} starColor={starColor} />
      </m.div>
      {children}
    </div>
  );
}
