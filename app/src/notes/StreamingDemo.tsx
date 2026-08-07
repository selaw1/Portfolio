import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, AlertTriangle } from 'lucide-react';

/**
 * Models memory use while exporting N rows two ways: building the whole file
 * in memory before writing it, versus streaming it out in chunks.
 *
 * Costs are a model — a fixed per-row footprint and a fixed chunk size — but
 * the shape is the real one: buffered grows without bound, streamed sawtooths
 * around a constant.
 */
const KB_PER_ROW = 0.9;
const CHUNK_ROWS = 2000;
const CONTAINER_MB = 512;
const BASELINE_MB = 60;

const PRESETS = [
  { label: 'A team', rows: 5_000 },
  { label: 'A department', rows: 120_000 },
  { label: 'The whole table', rows: 1_000_000 },
];

const mb = (rows: number) => (rows * KB_PER_ROW) / 1024;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function StreamingDemo() {
  const [rows, setRows] = useState(1_000_000);
  const [streamed, setStreamed] = useState(false);
  const [progress, setProgress] = useState(1);
  const raf = useRef<number | null>(null);
  const reduced = useMemo(() => prefersReducedMotion(), []);

  const peakBuffered = BASELINE_MB + mb(rows);
  const peakStreamed = BASELINE_MB + mb(CHUNK_ROWS);
  const oom = !streamed && peakBuffered > CONTAINER_MB;

  // Replay the export whenever the inputs change.
  useEffect(() => {
    // Reduced motion keeps the trace fully drawn — `progress` already starts
    // at 1, so there is nothing to set.
    if (reduced) return;
    if (raf.current) cancelAnimationFrame(raf.current);

    const start = performance.now();
    const tick = (now: number) => {
      // rAF hands back the frame timestamp, which can predate `start` — clamp
      // both ends or the reveal width goes negative on the first frame.
      const t = Math.min(1, Math.max(0, (now - start) / 1400));
      setProgress(t);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [rows, streamed, reduced]);

  // Memory trace across the export.
  const path = useMemo(() => {
    const points = 64;
    const ceiling = Math.max(CONTAINER_MB, peakBuffered) * 1.05;
    const coords: string[] = [];
    for (let i = 0; i <= points; i++) {
      const frac = i / points;
      let used: number;
      if (streamed) {
        // One chunk in flight at a time — a small sawtooth, flat on average.
        const phase = (i % 6) / 6;
        used = BASELINE_MB + mb(CHUNK_ROWS) * (0.35 + phase * 0.65);
      } else {
        used = BASELINE_MB + mb(rows) * frac;
      }
      const capped = Math.min(used, ceiling);
      coords.push(`${frac * 100},${44 - (capped / ceiling) * 42}`);
    }
    return { d: coords.join(' '), ceilingY: 44 - (CONTAINER_MB / ceiling) * 42 };
  }, [rows, streamed, peakBuffered]);

  const deathX = oom ? Math.min(100, (CONTAINER_MB - BASELINE_MB) / mb(rows) * 100) : null;
  const shown = Math.min(progress * 100, oom && deathX !== null ? deathX : 100);

  return (
    <div className="card-solid rounded-2xl overflow-hidden">
      {/* Controls */}
      <div className="p-5 sm:p-6 border-b border-border flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Export strategy">
          {[
            { on: false, label: 'build then send' },
            { on: true, label: 'stream in chunks' },
          ].map(({ on, label }) => (
            <button
              key={label}
              onClick={() => setStreamed(on)}
              aria-pressed={streamed === on}
              className={`px-4 py-2 rounded-md text-xs font-mono font-medium border transition-colors duration-200 cursor-pointer focus-ring ${
                streamed === on
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
              htmlFor="export-rows"
              className="text-xs font-mono text-muted-foreground uppercase tracking-widest"
            >
              Rows exported
            </label>
            <span className="font-display font-bold text-foreground text-lg tabular-nums">
              {rows.toLocaleString('en-GB')}
            </span>
          </div>
          <input
            id="export-rows"
            type="range"
            min={1000}
            max={1_000_000}
            step={1000}
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            className="w-full accent-[hsl(var(--primary))] cursor-pointer focus-ring rounded"
          />
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setRows(p.rows)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-200 cursor-pointer focus-ring ${
                  rows === p.rows
                    ? 'bg-primary/15 text-primary border-primary/40'
                    : 'bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-primary/30'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Memory trace */}
      <div className="p-5 sm:p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Container memory
          </p>
          <p className="text-xs font-mono text-muted-foreground tabular-nums">
            limit {CONTAINER_MB} MB
          </p>
        </div>

        <div className="relative">
          <svg viewBox="0 0 100 46" className="w-full h-36" preserveAspectRatio="none" role="img"
               aria-label={streamed
                 ? 'Memory holds steady near the baseline for the whole export.'
                 : 'Memory climbs with every row until it crosses the container limit.'}>
            {/* Limit line */}
            <line x1="0" y1={path.ceilingY} x2="100" y2={path.ceilingY}
                  stroke="rgb(248 113 113)" strokeWidth="0.5" strokeDasharray="2 2"
                  vectorEffect="non-scaling-stroke" opacity="0.7" />
            <clipPath id="reveal">
              <rect x="0" y="0" width={shown} height="46" />
            </clipPath>
            <polyline points={path.d} fill="none" clipPath="url(#reveal)"
                      stroke={streamed ? 'rgb(52 211 153)' : 'rgb(248 113 113)'}
                      strokeWidth="1" vectorEffect="non-scaling-stroke" />
            {oom && deathX !== null && progress * 100 >= deathX && (
              <line x1={deathX} y1="0" x2={deathX} y2="46" stroke="rgb(248 113 113)"
                    strokeWidth="1" vectorEffect="non-scaling-stroke" />
            )}
          </svg>
          {oom && deathX !== null && progress * 100 >= deathX && (
            <p className="absolute top-1 right-2 text-[10px] font-mono text-red-400">
              killed — OOM
            </p>
          )}
        </div>
      </div>

      {/* Verdict */}
      <div className="p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-3 gap-5" aria-live="polite">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground font-medium">Peak memory</span>
          <span className={`font-display font-bold text-2xl tabular-nums ${oom ? 'text-red-400' : 'text-foreground'}`}>
            {(streamed ? peakStreamed : peakBuffered).toFixed(0)}
            <span className="text-sm font-normal text-muted-foreground ml-1">MB</span>
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground font-medium">Grows with rows</span>
          <span className="font-display font-bold text-2xl text-foreground">
            {streamed ? 'No' : 'Yes'}
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1 flex items-start gap-2">
          {streamed ? (
            <>
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-1" aria-hidden="true" />
              <span className="text-xs text-muted-foreground leading-relaxed">
                One chunk in flight at a time. The export costs the same whether it's a thousand
                rows or a million.
              </span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-1" aria-hidden="true" />
              <span className="text-xs text-muted-foreground leading-relaxed">
                {oom
                  ? 'Killed before it finished. The user sees a 502 and tries again, which kills it again.'
                  : 'Survives at this size. Nothing warns you how close the ceiling is.'}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
