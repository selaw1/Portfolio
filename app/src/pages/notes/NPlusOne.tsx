import NoteLayout from '../../components/NoteLayout';
import NPlusOneDemo from '../../notes/NPlusOneDemo';
import { noteBySlug } from '../../notes/registry';

export default function NPlusOne() {
  const meta = noteBySlug('n-plus-one')!;

  return (
    <NoteLayout note={meta}>
      <p>
        Every Django codebase has one. It passes review, passes tests, and ships — because on a
        development database with a dozen rows, the difference is single-digit milliseconds. The ORM
        gives you no signal at all:{' '}
        <code className="font-mono text-sm text-foreground/80">route.stops.all()</code> reads like an
        attribute access and behaves like a network call.
      </p>

      <p>The cost is linear in a number that only grows in production. Drag the slider.</p>

      <div className="my-10">
        <NPlusOneDemo />
        <p className="text-xs text-muted-foreground/70 mt-4 leading-relaxed">
          Timings are modelled from a fixed per-query round-trip, not measured against a live
          database — the shape of the curve is the point, not the absolute numbers.
        </p>
      </div>

      <h2>Why it survives review</h2>

      <p>
        The fix is old news. What's worth internalising is the failure mode:{' '}
        <strong>the bug is invisible at the size you develop at</strong>. Nobody merges this because
        they don't know about <code className="font-mono text-sm text-foreground/80">prefetch_related</code>
        {' '}— they merge it because the page felt fast when they checked, and the seed data had twelve
        rows in it.
      </p>

      <p>
        That's also why "read the code more carefully" doesn't work as a remedy. The line that costs
        you 500 queries looks exactly like the line that costs you none. You cannot see the loop from
        inside the loop.
      </p>

      <h2>Make it fail at review time instead</h2>

      <p>
        The durable fix isn't the query — it's asserting on the query <em>count</em>, so the
        regression breaks a test on the branch rather than a dashboard at 2am:
      </p>

      <pre className="card-solid rounded-xl p-5 text-xs font-mono leading-relaxed overflow-x-auto text-foreground/80 my-6">
{`def test_route_list_is_constant_query(client):
    with assertNumQueries(2):
        client.get("/api/routes/")`}
      </pre>

      <p>
        Two queries, pinned. Add a route with a new relation and forget to prefetch it, and this test
        fails immediately with a diff that names the exact SQL that got added. It costs three lines
        and it converts an invisible, size-dependent performance bug into an ordinary red build.
      </p>

      <p>
        The general shape is worth keeping: when a bug only appears at a scale you don't develop at,
        stop trying to catch it by looking, and put a number on it that a machine can check.
      </p>
    </NoteLayout>
  );
}
