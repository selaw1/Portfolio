import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, Check } from 'lucide-react';

type Mode = 'naive' | 'prefetch';

interface Query {
  sql: string;
  ms: number;
  flagged: boolean;
}

/*
 * Timings below are a model, not a measurement — a fixed per-query round-trip
 * plus a small cost that scales with result size. The point of the demo is the
 * shape of the curve (linear vs flat), which is what actually bites in prod.
 */
const BASE_QUERY_MS = 1.2;
const ROUNDTRIP_MS = 0.75;

const PRESETS = [
  { label: 'Your laptop', n: 12 },
  { label: 'Staging', n: 80 },
  { label: 'Production', n: 500 },
];

const MAX_VISIBLE_ROWS = 40;

function buildQueries(mode: Mode, n: number): Query[] {
  const out: Query[] = [
    {
      sql: `SELECT "routes"."id", "routes"."name" FROM "routes" LIMIT ${n}`,
      ms: BASE_QUERY_MS,
      flagged: false,
    },
  ];

  if (mode === 'naive') {
    for (let i = 0; i < n; i++) {
      out.push({
        sql: `SELECT "stops".* FROM "stops" WHERE "stops"."route_id" = ${4200 + i} ORDER BY "stops"."sequence" ASC`,
        ms: ROUNDTRIP_MS,
        flagged: true,
      });
    }
  } else {
    out.push({
      sql: `SELECT "stops".* FROM "stops" WHERE "stops"."route_id" IN (… ${n} ids) ORDER BY "stops"."sequence" ASC`,
      ms: 1.4 + n * 0.004,
      flagged: false,
    });
  }

  return out;
}

const CODE: Record<Mode, { line: string; dim?: boolean; mark?: boolean }[]> = {
  naive: [
    { line: 'routes = Route.objects.all()[:N]' },
    { line: '' },
    { line: 'for route in routes:' },
    { line: '    # one DB round-trip per route', dim: true },
    { line: '    render(route.stops.all())', mark: true },
  ],
  prefetch: [
    { line: 'ordered = Stop.objects.order_by("sequence")' },
    { line: '' },
    { line: 'routes = Route.objects.prefetch_related(' },
    { line: '    Prefetch("stops", queryset=ordered)', mark: true },
    { line: ').all()[:N]' },
    { line: '' },
    { line: 'for route in routes:' },
    { line: '    # already in memory — no extra queries', dim: true },
    { line: '    render(route.stops.all())' },
  ],
};

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export default function NPlusOneDemo() {
  const [mode, setMode] = useState<Mode>('naive');
  const [rowCount, setRowCount] = useState(12);
  const [revealed, setRevealed] = useState(0);
  const rafRef = useRef<number | null>(null);

  const queries = useMemo(() => buildQueries(mode, rowCount), [mode, rowCount]);

  const totalMs = useMemo(
    () => queries.reduce((sum, q) => sum + q.ms, 0),
    [queries]
  );

  // Speedup against the naive path at the same row count, so the number stays
  // meaningful while you drag the slider.
  const speedup = useMemo(() => {
    const naive = buildQueries('naive', rowCount).reduce((s, q) => s + q.ms, 0);
    const fast = buildQueries('prefetch', rowCount).reduce((s, q) => s + q.ms, 0);
    return naive / fast;
  }, [rowCount]);

  const reduced = useMemo(() => prefersReducedMotion(), []);

  // Stream the query log in so the pile-up is something you watch happen
  // rather than a number that was always there.
  //
  // Reduced motion fills it in a single frame rather than short-circuiting the
  // render: `reduced` is false during SSR and true on the client, so deriving
  // the rendered row count from it directly is a hydration mismatch.
  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const duration = reduced ? 0 : mode === 'naive' ? 900 : 400;
    const start = performance.now();

    const tick = (now: number) => {
      // Clamped at both ends: the rAF frame timestamp can predate `start`.
      const t = duration === 0 ? 1 : Math.min(1, Math.max(0, (now - start) / duration));
      const eased = 1 - Math.pow(1 - t, 3);
      setRevealed(Math.ceil(eased * queries.length));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [queries, mode, reduced]);

  // Clamped, since `revealed` lags a frame behind a change in query count.
  const shown = Math.min(revealed, queries.length);
  const visible = queries.slice(0, Math.min(shown, MAX_VISIBLE_ROWS));
  const hidden = Math.max(0, shown - MAX_VISIBLE_ROWS);

  return (
    <div className="card-solid rounded-2xl overflow-hidden">
      {/* ── Controls ─────────────────────────────────────── */}
      <div className="p-5 sm:p-6 border-b border-border flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="ORM strategy">
          {(['naive', 'prefetch'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`px-4 py-2 rounded-md text-xs font-mono font-medium border transition-colors duration-200 cursor-pointer focus-ring ${
                mode === m
                  ? 'bg-primary/15 text-primary border-primary/40'
                  : 'bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-primary/30'
              }`}
            >
              {m === 'naive' ? '.all()' : '.prefetch_related()'}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <label
              htmlFor="row-count"
              className="text-xs font-mono text-muted-foreground uppercase tracking-widest"
            >
              Routes in table
            </label>
            <span className="font-display font-bold text-foreground text-lg tabular-nums">
              {rowCount}
            </span>
          </div>

          <input
            id="row-count"
            type="range"
            min={5}
            max={500}
            step={1}
            value={rowCount}
            onChange={(e) => setRowCount(Number(e.target.value))}
            className="w-full accent-[hsl(var(--primary))] cursor-pointer focus-ring rounded"
          />

          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setRowCount(p.n)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-200 cursor-pointer focus-ring ${
                  rowCount === p.n
                    ? 'bg-primary/15 text-primary border-primary/40'
                    : 'bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-primary/30'
                }`}
              >
                {p.label} · {p.n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Code + query log ─────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-px bg-border">
        {/* Code */}
        <div className="bg-card p-5 sm:p-6">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
            views.py
          </p>
          <pre className="text-xs font-mono leading-relaxed overflow-x-auto">
            {CODE[mode].map((row, i) => (
              <div
                key={i}
                className={
                  row.dim
                    ? 'text-muted-foreground/60'
                    : row.mark
                      ? 'text-primary'
                      : 'text-foreground/80'
                }
              >
                {row.line || ' '}
              </div>
            ))}
          </pre>
        </div>

        {/* Query log */}
        <div className="bg-card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              connection.queries
            </p>
            <span
              className={`text-xs font-mono tabular-nums ${
                mode === 'naive' && rowCount > 40 ? 'text-red-400' : 'text-muted-foreground'
              }`}
            >
              {queries.length}
            </span>
          </div>

          <div className="h-56 overflow-y-auto flex flex-col gap-1 pr-1">
            {visible.map((q, i) => (
              <div
                key={i}
                className={`shrink-0 text-[10px] font-mono leading-relaxed truncate ${
                  q.flagged ? 'text-red-400/70' : 'text-emerald-400/80'
                }`}
                title={q.sql}
              >
                <span className="text-muted-foreground/50 mr-2 tabular-nums">
                  {String(i + 1).padStart(3, '0')}
                </span>
                {q.sql}
              </div>
            ))}

            {hidden > 0 && (
              <div className="shrink-0 text-[10px] font-mono text-red-400/70 pt-1">
                … and {hidden} more identical queries
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Verdict ──────────────────────────────────────── */}
      <div
        className="p-5 sm:p-6 border-t border-border grid grid-cols-2 sm:grid-cols-3 gap-5"
        aria-live="polite"
      >
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground font-medium">Queries</span>
          <span className="font-display font-bold text-2xl tabular-nums text-foreground">
            {queries.length}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground font-medium">Modelled time</span>
          <span
            className={`font-display font-bold text-2xl tabular-nums ${
              mode === 'naive' && totalMs > 100 ? 'text-red-400' : 'text-foreground'
            }`}
          >
            {totalMs.toFixed(1)}
            <span className="text-sm font-normal text-muted-foreground ml-1">ms</span>
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1 flex items-start gap-2">
          {mode === 'naive' ? (
            <>
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-1" aria-hidden="true" />
              <span className="text-xs text-muted-foreground leading-relaxed">
                {rowCount <= 20
                  ? 'Looks fine. This is the size of your dev database — which is exactly why it ships.'
                  : `${speedup.toFixed(0)}× slower than it needs to be. Same code that passed review.`}
              </span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-1" aria-hidden="true" />
              <span className="text-xs text-muted-foreground leading-relaxed">
                Two queries. Flat as the table grows — that's the whole fix.
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
