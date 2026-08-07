import { useMemo, useState } from 'react';
import { Check, AlertTriangle } from 'lucide-react';

/**
 * Models a TimescaleDB hypertable read two ways over a widening time range:
 * scanning the raw rows, versus reading a continuous aggregate that has
 * already rolled them up per hour.
 *
 * The numbers are a model, not a benchmark — a fixed per-row scan cost and a
 * fixed per-bucket read cost. The point is the shape: one line is linear in
 * the range, the other is flat.
 */
const ROWS_PER_HOUR = 3600; // one reading a second
const NS_PER_ROW = 0.00004; // ms per raw row scanned
const MS_PER_BUCKET = 0.012; // ms per pre-aggregated hourly bucket
const PLAN_MS = 0.4;

const PRESETS = [
  { label: 'Last day', hours: 24 },
  { label: 'Last month', hours: 24 * 30 },
  { label: 'Last year', hours: 24 * 365 },
];

const fmt = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}k` : String(n);

export default function AggregateDemo() {
  const [hours, setHours] = useState(24 * 30);
  const [useAggregate, setUseAggregate] = useState(false);

  const stats = useMemo(() => {
    const rawRows = hours * ROWS_PER_HOUR;
    const rawMs = PLAN_MS + rawRows * NS_PER_ROW;
    const aggMs = PLAN_MS + hours * MS_PER_BUCKET;
    return {
      rawRows,
      buckets: hours,
      rawMs,
      aggMs,
      scanned: useAggregate ? hours : rawRows,
      ms: useAggregate ? aggMs : rawMs,
      speedup: rawMs / aggMs,
    };
  }, [hours, useAggregate]);

  // Curve across the full slider range, so you can see linear vs flat.
  const curve = useMemo(() => {
    const points = 40;
    const maxHours = 24 * 365;
    const raw: number[] = [];
    const agg: number[] = [];
    for (let i = 0; i <= points; i++) {
      const h = (maxHours / points) * i;
      raw.push(PLAN_MS + h * ROWS_PER_HOUR * NS_PER_ROW);
      agg.push(PLAN_MS + h * MS_PER_BUCKET);
    }
    const peak = Math.max(...raw);
    const toPath = (series: number[]) =>
      series
        .map((v, i) => `${(i / points) * 100},${40 - (v / peak) * 38}`)
        .join(' ');
    return { rawPath: toPath(raw), aggPath: toPath(agg) };
  }, []);

  const marker = (hours / (24 * 365)) * 100;

  return (
    <div className="card-solid rounded-2xl overflow-hidden">
      {/* Controls */}
      <div className="p-5 sm:p-6 border-b border-border flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Read strategy">
          {[
            { on: false, label: 'raw hypertable' },
            { on: true, label: 'continuous aggregate' },
          ].map(({ on, label }) => (
            <button
              key={label}
              onClick={() => setUseAggregate(on)}
              aria-pressed={useAggregate === on}
              className={`px-4 py-2 rounded-md text-xs font-mono font-medium border transition-colors duration-200 cursor-pointer focus-ring ${
                useAggregate === on
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
              htmlFor="range-hours"
              className="text-xs font-mono text-muted-foreground uppercase tracking-widest"
            >
              Time range
            </label>
            <span className="font-display font-bold text-foreground text-lg tabular-nums">
              {hours < 48 ? `${hours} h` : `${Math.round(hours / 24)} days`}
            </span>
          </div>
          <input
            id="range-hours"
            type="range"
            min={1}
            max={24 * 365}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full accent-[hsl(var(--primary))] cursor-pointer focus-ring rounded"
          />
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setHours(p.hours)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-200 cursor-pointer focus-ring ${
                  hours === p.hours
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

      {/* Curve */}
      <div className="p-5 sm:p-6 border-b border-border">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
          Query time as the range grows
        </p>
        <svg viewBox="0 0 100 42" className="w-full h-32" preserveAspectRatio="none" role="img"
             aria-label="Raw table scan cost rises linearly with the time range; the continuous aggregate stays nearly flat.">
          <polyline points={curve.rawPath} fill="none" stroke="rgb(248 113 113)" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
          <polyline points={curve.aggPath} fill="none" stroke="rgb(52 211 153)" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
          <line x1={marker} y1="0" x2={marker} y2="42" stroke="hsl(var(--primary))" strokeWidth="0.6"
                strokeDasharray="1.5 1.5" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-red-400" /> raw scan
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-emerald-400" /> continuous aggregate
          </span>
        </div>
      </div>

      {/* Verdict */}
      <div className="p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-3 gap-5" aria-live="polite">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground font-medium">Rows read</span>
          <span
            className={`font-display font-bold text-2xl tabular-nums ${
              useAggregate ? 'text-foreground' : 'text-red-400'
            }`}
          >
            {fmt(stats.scanned)}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground font-medium">Modelled time</span>
          <span
            className={`font-display font-bold text-2xl tabular-nums ${
              !useAggregate && stats.ms > 100 ? 'text-red-400' : 'text-foreground'
            }`}
          >
            {stats.ms.toFixed(1)}
            <span className="text-sm font-normal text-muted-foreground ml-1">ms</span>
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1 flex items-start gap-2">
          {useAggregate ? (
            <>
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-1" aria-hidden="true" />
              <span className="text-xs text-muted-foreground leading-relaxed">
                One row per hour, already summed. The dashboard stops caring how old the table is.
              </span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-1" aria-hidden="true" />
              <span className="text-xs text-muted-foreground leading-relaxed">
                {stats.speedup < 5
                  ? 'Fine at this range. It is also the range you built the dashboard against.'
                  : `${stats.speedup.toFixed(0)}× the work, recomputed on every dashboard load.`}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
