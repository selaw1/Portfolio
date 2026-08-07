import * as React from 'react';
import { useMotionValue, useSpring, useReducedMotion, type SpringOptions } from 'motion/react';
import { useIsInView, type UseIsInViewOptions } from '../../../hooks/use-is-in-view';

/**
 * Adapted from animate-ui's CountingNumber — see ../README.md.
 * Renders the final value immediately under prefers-reduced-motion, and
 * prerenders the final value so crawlers never see a zero.
 */
export type CountingNumberProps = Omit<React.ComponentProps<'span'>, 'children'> & {
  number: number;
  fromNumber?: number;
  decimalPlaces?: number;
  transition?: SpringOptions;
  delay?: number;
} & UseIsInViewOptions;

export function CountingNumber({
  ref,
  number,
  fromNumber = 0,
  inView = true,
  inViewMargin = '0px',
  inViewOnce = true,
  transition = { stiffness: 90, damping: 50 },
  decimalPlaces = 0,
  delay = 0,
  ...props
}: CountingNumberProps) {
  const reduced = useReducedMotion();
  const { ref: localRef, isInView } = useIsInView(ref as React.Ref<HTMLSpanElement>, {
    inView,
    inViewOnce,
    inViewMargin,
  });

  const motionVal = useMotionValue(reduced ? number : fromNumber);
  const springVal = useSpring(motionVal, transition);

  React.useEffect(() => {
    if (reduced) return;
    const id = setTimeout(() => {
      if (isInView) motionVal.set(number);
    }, delay);
    return () => clearTimeout(id);
  }, [isInView, number, motionVal, delay, reduced]);

  React.useEffect(() => {
    if (reduced) return;
    return springVal.on('change', (latest) => {
      if (localRef.current) {
        localRef.current.textContent =
          decimalPlaces > 0 ? latest.toFixed(decimalPlaces) : Math.round(latest).toString();
      }
    });
  }, [springVal, decimalPlaces, localRef, reduced]);

  // Server and first client render agree on the final value; the effect above
  // resets it to `fromNumber` only once motion is confirmed to be wanted.
  React.useEffect(() => {
    if (!reduced && localRef.current) localRef.current.textContent = String(fromNumber);
  }, [fromNumber, reduced, localRef]);

  return (
    <span ref={localRef} {...props}>
      {number.toFixed(decimalPlaces)}
    </span>
  );
}
