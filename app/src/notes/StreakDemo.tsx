import { useMemo, useState } from 'react';
import { Check, X } from 'lucide-react';

/**
 * Mirrors the shipped rule in workout/data.py: a gap breaks the streak only
 * when it exceeds grace_period_days + 1. Grace 0 is the naive "consecutive
 * calendar days" version most trackers use.
 */
const GRACE_DAYS = 3;
const WEEKS = 6;
const DAYS = WEEKS * 7;

/** A realistic block: trains 4x/week, takes rest days, and misses a week entirely. */
const TRAINED = new Set([
  0, 1, 3, 5,
  7, 8, 10, 12,
  14, 15, 17, 19,
  // week 4 — injury, nothing logged
  28, 30, 32,
  35, 36, 38, 40,
]);

function streakAt(dayIndex: number, grace: number): number {
  const trained = [...TRAINED].filter((d) => d <= dayIndex).sort((a, b) => a - b);
  if (trained.length === 0) return 0;

  let run = 1;
  for (let i = 1; i < trained.length; i++) {
    run = trained[i] - trained[i - 1] <= grace + 1 ? run + 1 : 1;
  }
  // The streak is live only if the gap since the last session is still inside grace.
  return dayIndex - trained[trained.length - 1] <= grace + 1 ? run : 0;
}

export default function StreakDemo() {
  const [grace, setGrace] = useState(GRACE_DAYS);
  const [today, setToday] = useState(DAYS - 1);

  const streak = useMemo(() => streakAt(today, grace), [today, grace]);
  const naive = useMemo(() => streakAt(today, 0), [today]);
  const alive = streak > 0;

  return (
    <div className="card-solid rounded-2xl overflow-hidden">
      {/* Controls */}
      <div className="p-5 sm:p-6 border-b border-border flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Streak rule">
          {[
            { g: 0, label: 'Consecutive days' },
            { g: GRACE_DAYS, label: `${GRACE_DAYS}-day grace` },
          ].map(({ g, label }) => (
            <button
              key={g}
              onClick={() => setGrace(g)}
              aria-pressed={grace === g}
              className={`px-4 py-2 rounded-md text-xs font-mono font-medium border transition-colors duration-200 cursor-pointer focus-ring ${
                grace === g
                  ? 'bg-primary/15 text-primary border-primary/40'
                  : 'bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-primary/30'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <label
              htmlFor="today"
              className="text-xs font-mono text-muted-foreground uppercase tracking-widest"
            >
              Day
            </label>
            <span className="font-display font-bold text-foreground text-lg tabular-nums">
              {today + 1}
            </span>
          </div>
          <input
            id="today"
            type="range"
            min={0}
            max={DAYS - 1}
            value={today}
            onChange={(e) => setToday(Number(e.target.value))}
            className="w-full accent-[hsl(var(--primary))] cursor-pointer focus-ring rounded"
          />
        </div>
      </div>

      {/* Calendar */}
      <div className="p-5 sm:p-6 border-b border-border">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
          Six weeks of training
        </p>
        <div className="grid grid-cols-7 gap-1.5 max-w-md">
          {Array.from({ length: DAYS }, (_, i) => {
            const did = TRAINED.has(i);
            const future = i > today;
            return (
              <div
                key={i}
                title={`Day ${i + 1}${did ? ' — trained' : ''}`}
                className={`aspect-square rounded-[4px] border transition-colors duration-200 ${
                  future
                    ? 'border-border/40 bg-transparent'
                    : did
                      ? 'border-primary/50 bg-primary/70'
                      : 'border-border bg-secondary/60'
                } ${i === today ? 'ring-2 ring-primary ring-offset-2 ring-offset-card' : ''}`}
              />
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-[3px] bg-primary/70 border border-primary/50" /> trained
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-[3px] bg-secondary/60 border border-border" /> rest
          </span>
        </div>
      </div>

      {/* Verdict */}
      <div className="p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-3 gap-5" aria-live="polite">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground font-medium">Streak</span>
          <span
            className={`font-display font-bold text-2xl tabular-nums ${
              alive ? 'text-foreground' : 'text-red-400'
            }`}
          >
            {streak}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground font-medium">Naive rule</span>
          <span className="font-display font-bold text-2xl tabular-nums text-muted-foreground">
            {naive}
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1 flex items-start gap-2">
          {alive ? (
            <>
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-1" aria-hidden="true" />
              <span className="text-xs text-muted-foreground leading-relaxed">
                {grace === 0
                  ? 'Alive — but only because today happens to follow a training day.'
                  : 'Rest days are part of the plan. The streak survives them.'}
              </span>
            </>
          ) : (
            <>
              <X className="w-4 h-4 text-red-400 shrink-0 mt-1" aria-hidden="true" />
              <span className="text-xs text-muted-foreground leading-relaxed">
                {grace === 0
                  ? 'Broken by a rest day — the thing the training plan told them to take.'
                  : 'Broken. A week off is a real gap, and the streak should say so.'}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
