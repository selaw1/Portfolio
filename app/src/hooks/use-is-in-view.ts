import * as React from 'react';
import { useInView, type UseInViewOptions } from 'motion/react';

export interface UseIsInViewOptions {
  inView?: boolean;
  inViewOnce?: boolean;
  inViewMargin?: UseInViewOptions['margin'];
}

/** Adapted from animate-ui — see components/animate-ui/README.md. */
export function useIsInView<T extends HTMLElement = HTMLElement>(
  ref: React.Ref<T>,
  options: UseIsInViewOptions = {}
) {
  const { inView, inViewOnce = true, inViewMargin = '0px' } = options;
  const localRef = React.useRef<T>(null);
  React.useImperativeHandle(ref, () => localRef.current as T);
  const inViewResult = useInView(localRef, { once: inViewOnce, margin: inViewMargin });
  return { ref: localRef, isInView: !inView || inViewResult };
}
