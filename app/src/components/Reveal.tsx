import { m, type HTMLMotionProps } from 'motion/react';

/**
 * The single scroll-reveal used across the site, replacing the GSAP +
 * ScrollTrigger setup that every section used to carry its own copy of.
 *
 * Transform and opacity only — never layout properties — at 450ms with an
 * ease-out curve.
 *
 * Reduced motion is handled globally by <MotionConfig reducedMotion="user">
 * in App.tsx rather than by branching here. Branching on useReducedMotion()
 * is a trap: it returns null during SSR, so the animated branch renders
 * first and writes `opacity: 0` inline, and the later non-animated branch
 * carries no style prop to overwrite it with — leaving the page invisible to
 * exactly the users who asked for less motion.
 */
export type RevealProps = HTMLMotionProps<'div'> & {
  /** Seconds. Use with `index` for staggered groups. */
  delay?: number;
  /** Position in a group; adds 60ms per step on top of `delay`. */
  index?: number;
  /** Travel distance in px. */
  y?: number;
};

export function Reveal({ children, delay = 0, index = 0, y = 20, ...props }: RevealProps) {
  return (
    <m.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
        delay: delay + index * 0.06,
      }}
      {...props}
    >
      {children}
    </m.div>
  );
}
