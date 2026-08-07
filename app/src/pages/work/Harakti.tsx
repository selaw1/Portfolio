import CaseStudyLayout from '../../components/CaseStudyLayout';
import StreakDemo from '../../notes/StreakDemo';
import { workBySlug } from '../../notes/registry';

export default function Harakti() {
  const meta = workBySlug('harakti')!;

  return (
    <CaseStudyLayout work={meta}>
      <p>
        Harakti (<span lang="ar" dir="rtl">حركتي</span>, "my movement") is a gym tracker for people
        who train seriously and live in two languages. You log sets, reps, weight and RIR mid-workout,
        it tracks your PRs and weekly volume per muscle, and it keeps a streak that promotes you
        through eleven tiers. It's on the App Store, Google Play and the web, it's free, and it works
        identically in English and Arabic.
      </p>

      <p>
        I built all of it — product, Django backend, React frontend, and the Capacitor mobile
        shell. What follows is three decisions I'd defend in an interview, including one where I
        shipped the worse implementation on purpose.
      </p>


      <h2>1. The gym has no signal</h2>

      <p>
        The core interaction happens in a basement with concrete walls, between sets, on a phone with
        one bar. If logging a set requires a round-trip, the app is unusable exactly when it matters.
        And a workout is a long-lived thing — 60 to 90 minutes, during which the user will lock their
        phone, take calls, and let the OS kill the app.
      </p>

      <p>
        So the active session is a local-first draft. New sets are created client-side with{' '}
        <code>crypto.randomUUID()</code> and flagged <code>_isLocal</code>. The whole draft is
        persisted to <code>localStorage</code>, so an app kill mid-session loses nothing. When a set
        finally syncs, the server's real id is swapped in and the flag clears:
      </p>

      <pre className="card-solid rounded-xl p-5 text-xs font-mono leading-relaxed overflow-x-auto text-foreground/80 my-6">
{`// the API distinguishes create from update by a null id
completeSetApi.mutate({
    path: { exercise_log_id: exerciseLogId },
    body: { ..., set_log_id: set._isLocal ? null : set.id },
})

// on success, reconcile the client id with the server's
onSuccess: (data) => {
    if (set._isLocal) replaceSetId(sessionId, exerciseLogId, set.id, data.id)
}`}
      </pre>

      <p>
        The subtle part isn't the optimistic write — it's that the server must never overwrite a live
        draft. Refetching an in-progress session returns the last synced state, which is <em>older</em>{' '}
        than what's on the user's screen. So session initialisation refuses to clobber:
      </p>

      <pre className="card-solid rounded-xl p-5 text-xs font-mono leading-relaxed overflow-x-auto text-foreground/80 my-6">
{`initSession: (session) =>
    set((state) => {
        if (state.activeSession[session.id]) return state  // keep local draft
        return { ...enhance(session) }
    }),`}
      </pre>

      <p>
        Four lines, and they're the difference between "resumed my workout" and "lost the last three
        sets I did." That kind of bug doesn't show up in development, where the network is instant
        and you never background the app.
      </p>

      <h2>2. A streak that understands rest days</h2>

      <p>
        Every habit app defines a streak as consecutive calendar days. For a gym app that's actively
        wrong: rest days aren't failure, they're the training plan. Muscle grows during recovery. An
        app that breaks your streak for resting is punishing users for training correctly, and it
        pushes exactly the behaviour a fitness product should not push.
      </p>

      <p>
        So a Harakti streak breaks on a gap, not on a missed day. The shipped rule allows a three-day
        grace period — enough for a rest day or a deload weekend, not enough to cover quitting for a
        week. Drag through six weeks of a realistic training block and switch between the two rules:
      </p>

      <div className="my-10">
        <StreakDemo />
        <p className="text-xs text-muted-foreground/70 mt-4 leading-relaxed">
          Same training history, both rules. The calendar is representative sample data; the rule
          itself is the one running in production.
        </p>
      </div>

      <p>
        Two details that only show up once real users exist. First, "today" is not a UTC concept — a
        session at 11pm in Dubai and one at 11pm in London are different calendar days, so day
        boundaries are truncated in the user's own timezone:
      </p>

      <pre className="card-solid rounded-xl p-5 text-xs font-mono leading-relaxed overflow-x-auto text-foreground/80 my-6">
{`workout_log_qs.annotate(
    local_date=TruncDate("started_at", tzinfo=ZoneInfo(timezone))
).values("local_date")`}
      </pre>

      <p>
        Second, "did you train today" has two sources: a logged Harakti session, and a heavy activity
        pulled from Apple Health or Health Connect. Both should count. But a workout logged in the app
        <em> also</em> lands in the health platform, so a naive union double-counts it. The fix is an
        exclusion on the source, so a native activity only counts when it didn't originate here:
      </p>

      <pre className="card-solid rounded-xl p-5 text-xs font-mono leading-relaxed overflow-x-auto text-foreground/80 my-6">
{`activity_qs
    .filter(label__is_heavy_activity=True)
    .exclude(source=ActivitySource.EXPLICIT_NATIVE, workout_log__isnull=True)`}
      </pre>


      <h2>3. The leaderboard I shipped knowing it was wrong</h2>

      <p>
        Monthly leaderboards, filtered to your country or just to friends, with your own rank always
        pinned even when you're nowhere near the top 50. The implementation is deliberately naive: it
        loads every active user in the country, computes each one's streak, sorts the list in Python,
        and slices the top 50.
      </p>

      <p>
        That's <code>O(users in country)</code> work on every single request. It will not survive
        growth. I shipped it anyway, and I'd do it again — at launch scale it returns comfortably
        inside a normal request, it reuses the exact streak function the profile screen uses (so the
        number on the leaderboard can never disagree with the number on your profile), and it took an
        afternoon instead of a week. Optimising it before anyone was on it would have been the more
        expensive mistake.
      </p>

      <p>
        What matters is knowing the trigger and the replacement. The trigger is the country user count
        where the endpoint's p95 crosses roughly 300ms. The replacement is a materialised{' '}
        <code>streak_snapshot</code> table keyed by user and month, refreshed by the Celery beat
        schedule that already exists, ranked with a window function rather than a Python sort:
      </p>

      <pre className="card-solid rounded-xl p-5 text-xs font-mono leading-relaxed overflow-x-auto text-foreground/80 my-6">
{`RANK() OVER (PARTITION BY country, month ORDER BY current_streak DESC)`}
      </pre>

      <p>
        That turns both queries into indexed lookups: the top 50 is a <code>LIMIT</code>, and your own
        rank is a single row fetch instead of scanning a list you aren't in. It's a schema change and a
        scheduled job, not a rewrite — which is the actual point. The naive version was cheap to build{' '}
        <em>and</em> cheap to replace, because the streak logic it calls stays exactly where it is.
      </p>


      <h2>Arabic is not a translation layer</h2>

      <p>
        Harakti is fully bilingual, and Arabic was a first-class target from the first commit rather
        than a locale file added later. That distinction is mostly invisible until you try to retrofit
        it: right-to-left isn't a text property, it's a layout property, and it reaches into
        chart axes, calendar grids, progress directions, icon orientation and every asymmetric
        padding value in the codebase.
      </p>

      <p>
        Copy is written natively in both languages rather than machine-translated, which is why the
        Arabic reads like a gym app instead of like a documentation page.
      </p>


      <h2>Smaller decisions worth the space</h2>

      <p>
        <strong>Units are stored twice, on purpose.</strong> Users log in kg or lb, and both are
        preserved for display. But every comparison — personal records, estimated 1RM, weekly volume —
        needs a single canonical unit, so <code>weight_kg</code> is computed on save and carries a
        composite index alongside reps. PR queries never convert inside SQL.
      </p>

      <p>
        <strong>Starting a session pre-fills from your last one</strong>, because the number you hit
        last week is the number to beat. The obvious implementation is a query per exercise; the
        shipped one resolves the most recent log per exercise with a correlated subquery and writes
        the new session with two <code>bulk_create</code> calls. Constant queries regardless of how
        many exercises are in the split — the same discipline as{' '}
        <a href="/notes/n-plus-one">the N+1 note</a>.
      </p>

      <p>
        <strong>Access tokens never touch localStorage.</strong> Theme, language and the active
        session draft persist; auth state is deliberately memory-only, because a token in
        localStorage is one XSS away from being someone else's.
      </p>

      <h2>What I'd do differently</h2>

      <p>
        The leaderboard is the known debt and it has a plan, so it isn't the interesting answer. The
        honest one is that streaks are computed on read, everywhere — profile, leaderboard, home
        screen — from raw session dates. That was the right call while the rule was still changing,
        and the grace period did change. But the rule is stable now, and recomputing a derived value
        on every read is a decision I keep paying for rather than one I revisit.
      </p>

      <p>
        The second is that I let the offline story stay implicit. Local-first drafts do the important
        work, but there's no retry queue: if a sync fails while the user is disconnected, the set stays
        local until they touch it again. It has never lost data, because the draft is persisted — but
        "never lost data" and "guaranteed to converge" are different claims, and only one of them is
        true today.
      </p>
    </CaseStudyLayout>
  );
}
