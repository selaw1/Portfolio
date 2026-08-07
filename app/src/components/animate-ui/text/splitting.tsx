import * as React from 'react';
import { m, type Transition } from 'motion/react';
import { useIsInView, type UseIsInViewOptions } from '../../../hooks/use-is-in-view';

/**
 * Adapted from animate-ui's Splitting text — see ../README.md.
 *
 * Splits on words (never characters) so screen readers and text selection
 * still see whole words. Stagger is 40ms, inside the 30-50ms the design
 * rules ask for.
 *
 * Reduced motion is left to <MotionConfig reducedMotion="user">, which drops
 * the transform and settles opacity. Branching on useReducedMotion() here
 * would leave the heading permanently invisible: the hook is null during SSR,
 * so the animated branch renders and writes opacity 0 before the plain branch
 * ever gets a chance to replace it.
 */
export type SplittingTextProps = Omit<React.ComponentProps<'span'>, 'children'> & {
  text: string;
  delay?: number;
  stagger?: number;
  transition?: Transition;
} & UseIsInViewOptions;

export function SplittingText({
  ref,
  text,
  delay = 0,
  stagger = 0.04,
  transition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  inView = true,
  inViewMargin = '0px',
  inViewOnce = true,
  ...props
}: SplittingTextProps) {
  const { ref: localRef, isInView } = useIsInView(ref as React.Ref<HTMLSpanElement>, {
    inView,
    inViewOnce,
    inViewMargin,
  });

  const words = React.useMemo(() => text.split(' '), [text]);

  return (
    <span ref={localRef} {...props}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <m.span
            className="inline-block"
            initial={{ y: '100%', opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : undefined}
            transition={{ ...transition, delay: delay + i * stagger }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </m.span>
        </span>
      ))}
    </span>
  );
}
