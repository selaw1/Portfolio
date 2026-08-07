import { useMemo, useState } from 'react';
import { Check, X } from 'lucide-react';

/**
 * Mirrors the shipped rule in workout/data.py, where a session's calendar day
 * is truncated in the user's own timezone rather than in UTC:
 *
 *   TruncDate("started_at", tzinfo=ZoneInfo(user_timezone))
 */
const CITIES = [
  { name: 'Dubai', tz: 'Asia/Dubai', offset: 4 },
  { name: 'London', tz: 'Europe/London', offset: 1 },
  { name: 'São Paulo', tz: 'America/Sao_Paulo', offset: -3 },
  { name: 'Los Angeles', tz: 'America/Los_Angeles', offset: -7 },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const pad = (n: number) => String(n).padStart(2, '0');

export default function TimezoneDemo() {
  const [cityIndex, setCityIndex] = useState(0);
  const [localHour, setLocalHour] = useState(23);

  const city = CITIES[cityIndex];

  const result = useMemo(() => {
    // The session happens on Wednesday at `localHour` local time.
    const localDayIndex = 2; // Wednesday
    const utcHour = localHour - city.offset;

    // Which calendar day does UTC think this is?
    let utcDayIndex = localDayIndex;
    let shownUtcHour = utcHour;
    if (utcHour < 0) {
      utcDayIndex -= 1;
      shownUtcHour += 24;
    } else if (utcHour >= 24) {
      utcDayIndex += 1;
      shownUtcHour -= 24;
    }

    return {
      localDay: DAYS[localDayIndex],
      localHour,
      utcDay: DAYS[(utcDayIndex + 7) % 7],
      utcHour: shownUtcHour,
      agrees: utcDayIndex === localDayIndex,
    };
  }, [city, localHour]);

  return (
    <div className="card-solid rounded-2xl overflow-hidden">
      {/* Controls */}
      <div className="p-5 sm:p-6 border-b border-border flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="User timezone">
          {CITIES.map((c, i) => (
            <button
              key={c.name}
              onClick={() => setCityIndex(i)}
              aria-pressed={cityIndex === i}
              className={`px-3 py-2 rounded-md text-xs font-mono font-medium border transition-colors duration-200 cursor-pointer focus-ring ${
                cityIndex === i
                  ? 'bg-primary/15 text-primary border-primary/40'
                  : 'bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-primary/30'
              }`}
            >
              {c.name}
              <span className="ml-1.5 text-muted-foreground/70">
                UTC{c.offset >= 0 ? '+' : ''}{c.offset}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <label
              htmlFor="local-hour"
              className="text-xs font-mono text-muted-foreground uppercase tracking-widest"
            >
              Session logged at (local)
            </label>
            <span className="font-display font-bold text-foreground text-lg tabular-nums">
              {pad(localHour)}:00
            </span>
          </div>
          <input
            id="local-hour"
            type="range"
            min={0}
            max={23}
            value={localHour}
            onChange={(e) => setLocalHour(Number(e.target.value))}
            className="w-full accent-[hsl(var(--primary))] cursor-pointer focus-ring rounded"
          />
        </div>
      </div>

      {/* The two readings */}
      <div className="grid sm:grid-cols-2 gap-px bg-border">
        <div className="bg-card p-5 sm:p-6">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
            Truncated in {city.tz}
          </p>
          <p className="font-display font-bold text-3xl text-emerald-400 mb-1">{result.localDay}</p>
          <p className="text-xs font-mono text-muted-foreground tabular-nums">
            {pad(result.localHour)}:00 local
          </p>
        </div>

        <div className="bg-card p-5 sm:p-6">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
            Truncated in UTC
          </p>
          <p
            className={`font-display font-bold text-3xl mb-1 ${
              result.agrees ? 'text-foreground' : 'text-red-400'
            }`}
          >
            {result.utcDay}
          </p>
          <p className="text-xs font-mono text-muted-foreground tabular-nums">
            {pad(result.utcHour)}:00 UTC
          </p>
        </div>
      </div>

      {/* Verdict */}
      <div className="p-5 sm:p-6 border-t border-border flex items-start gap-2.5" aria-live="polite">
        {result.agrees ? (
          <>
            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
            <span className="text-xs text-muted-foreground leading-relaxed">
              Both agree at this hour. This is the window your tests run in, which is why the
              bug survives them.
            </span>
          </>
        ) : (
          <>
            <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
            <span className="text-xs text-muted-foreground leading-relaxed">
              UTC files this session under <strong className="text-foreground">{result.utcDay}</strong>,
              the user calls it <strong className="text-foreground">{result.localDay}</strong>. Two
              sessions on the same real day now count as one — or worse, a streak breaks while the
              user is looking at a calendar that says it shouldn't have.
            </span>
          </>
        )}
      </div>
    </div>
  );
}
