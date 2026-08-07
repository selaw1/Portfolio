import NoteLayout from '../../components/NoteLayout';
import TimezoneDemo from '../../notes/TimezoneDemo';
import { noteBySlug } from '../../notes/registry';

export default function TimezoneDay() {
  const meta = noteBySlug('what-day-is-it')!;

  return (
    <NoteLayout note={meta}>
      <p>
        Almost every product eventually asks "did this happen today?" — a streak, a daily limit, a
        report grouped by date, a "you've already checked in" badge. It reads like a trivial
        question. It is not: <strong>a day is a property of a place, not of a timestamp</strong>.
      </p>

      <p>
        Move the session around the clock and watch the two answers separate:
      </p>

      <div className="my-10">
        <TimezoneDemo />
      </div>

      <h2>Why it hides</h2>

      <p>
        The gap only opens near the edges of the day, and only for users whose offset is far from
        the server's. If you develop in the same timezone your database reports in, and you test at
        two in the afternoon, the two answers agree every single time. The bug is invisible in
        exactly the conditions you build under — and it lands on the users furthest from you.
      </p>

      <p>
        It also gets worse in the direction you least want. A user logging a late-night session
        gets it filed under tomorrow; a user in a negative offset gets it filed under yesterday.
        Both look, from the inside, like the app losing their work.
      </p>

      <h2>The fix is a parameter, not an algorithm</h2>

      <p>
        Postgres will truncate in whatever timezone you hand it. The mistake isn't reaching for the
        wrong function, it's calling the right one without an argument and inheriting the server's
        zone by accident. In Django that's one keyword:
      </p>

      <pre className="card-solid rounded-xl p-5 text-xs font-mono leading-relaxed overflow-x-auto text-foreground/80 my-6">
{`# wrong: "today" according to wherever the database happens to live
.annotate(day=TruncDate("started_at"))

# right: "today" according to the person who was there
.annotate(day=TruncDate("started_at", tzinfo=ZoneInfo(user_timezone)))`}
      </pre>

      <p>
        Which means the timezone has to be a real, stored property of the user, captured at signup
        and editable afterwards — not inferred from the browser on each request, and definitely not
        from an IP address. A user who travels does not want their streak history to rewrite itself
        every time they land somewhere.
      </p>

      <h2>Make the boundary explicit in tests</h2>

      <p>
        The same shape as any other invisible bug: you don't catch it by reading, you catch it by
        pinning the case that only fails at the edge. Freeze the clock somewhere awkward and assert
        the day:
      </p>

      <pre className="card-solid rounded-xl p-5 text-xs font-mono leading-relaxed overflow-x-auto text-foreground/80 my-6">
{`@pytest.mark.parametrize("tz,expected", [
    ("Asia/Dubai",          date(2026, 7, 8)),   # 23:30 local, still the 8th
    ("America/Los_Angeles", date(2026, 7, 7)),   # same instant, still the 7th
])
def test_day_boundary_is_local(tz, expected):
    at = datetime(2026, 7, 8, 19, 30, tzinfo=timezone.utc)
    assert local_day(at, tz) == expected`}
      </pre>

      <p>
        Two rows, one instant, two correct answers. If someone later "simplifies" the query by
        dropping the <code>tzinfo</code>, one of them goes red immediately — which is the whole
        point of writing it down.
      </p>
    </NoteLayout>
  );
}
