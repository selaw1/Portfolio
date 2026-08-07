import * as React from 'react';
import { flushSync } from 'react-dom';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../lib/utils';

/**
 * Adapted from animate-ui's Theme Toggler — see ../README.md.
 *
 * Changes from the original: it reads this site's ThemeContext instead of
 * next-themes, drops the `system` mode the context doesn't model, and skips
 * the wipe entirely under prefers-reduced-motion (a full-viewport clip-path
 * sweep is exactly the kind of motion that setting exists to suppress).
 * Browsers without the View Transitions API just switch instantly.
 */
type Direction = 'btt' | 'ttb' | 'ltr' | 'rtl';

function clipKeyframes(direction: Direction): [string, string] {
  switch (direction) {
    case 'ltr': return ['inset(0 100% 0 0)', 'inset(0 0 0 0)'];
    case 'rtl': return ['inset(0 0 0 100%)', 'inset(0 0 0 0)'];
    case 'ttb': return ['inset(0 0 100% 0)', 'inset(0 0 0 0)'];
    case 'btt': return ['inset(100% 0 0 0)', 'inset(0 0 0 0)'];
  }
}

export type ThemeTogglerButtonProps = React.ComponentProps<'button'> & {
  direction?: Direction;
};

export function ThemeTogglerButton({
  direction = 'ttb',
  className,
  onClick,
  ...props
}: ThemeTogglerButtonProps) {
  const { theme, toggleTheme } = useTheme();

  const handleClick = React.useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);

      const next = theme === 'dark' ? 'light' : 'dark';
      const reduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduced || !document.startViewTransition) {
        toggleTheme();
        return;
      }

      const [from, to] = clipKeyframes(direction);

      // Paint the new theme inside the transition so the wipe reveals it,
      // then let React state catch up once the sweep has finished.
      await document.startViewTransition(() => {
        flushSync(() => {
          document.documentElement.classList.toggle('dark', next === 'dark');
        });
      }).ready;

      document.documentElement
        .animate(
          { clipPath: [from, to] },
          {
            duration: 650,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        )
        .finished.finally(() => toggleTheme());
    },
    [direction, onClick, theme, toggleTheme]
  );

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label="Toggle colour theme"
        className={cn(
          'min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-200 focus-ring cursor-pointer',
          className
        )}
        {...props}
      >
        {/* Driven by the `dark` class, not React state, so the prerendered
            markup is identical whichever theme the visitor lands in. */}
        <Sun className="w-4 h-4 hidden dark:block" aria-hidden="true" />
        <Moon className="w-4 h-4 block dark:hidden" aria-hidden="true" />
      </button>
      <style>{`::view-transition-old(root),::view-transition-new(root){animation:none;mix-blend-mode:normal;}`}</style>
    </>
  );
}
