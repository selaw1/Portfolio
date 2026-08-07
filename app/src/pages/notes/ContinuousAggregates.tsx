import NoteLayout from '../../components/NoteLayout';
import AggregateDemo from '../../notes/AggregateDemo';
import { noteBySlug } from '../../notes/registry';

export default function ContinuousAggregates() {
  const meta = noteBySlug('continuous-aggregates')!;

  return (
    <NoteLayout note={meta}>
      <p>
        A time-series dashboard has a property most tables don't: the amount of work it does grows
        every single day, whether or not anybody changes the code. The query is the same, the
        index is the same, the plan is the same — there is simply more history to sweep through
        each time somebody opens it.
      </p>

      <p>
        Which means a dashboard that is fast at launch is not fast; it is <em>new</em>. Widen the
        range and watch the two strategies diverge:
      </p>

      <div className="my-10">
        <AggregateDemo />
        <p className="text-xs text-muted-foreground/70 mt-4 leading-relaxed">
          Modelled from a fixed per-row scan cost and a fixed per-bucket read cost, not measured
          against a live database — the shape of the two curves is the point, not the absolute
          numbers.
        </p>
      </div>

      <h2>Rolling up once instead of every time</h2>

      <p>
        A continuous aggregate is a materialised view that TimescaleDB keeps current for you. You
        declare the rollup once, and it maintains the buckets in the background as data lands:
      </p>

      <pre className="card-solid rounded-xl p-5 text-xs font-mono leading-relaxed overflow-x-auto text-foreground/80 my-6">
{`CREATE MATERIALIZED VIEW readings_hourly
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 hour', recorded_at) AS bucket,
    device_id,
    avg(value)   AS avg_value,
    max(value)   AS max_value,
    count(*)     AS samples
FROM readings
GROUP BY bucket, device_id;

SELECT add_continuous_aggregate_policy('readings_hourly',
    start_offset => INTERVAL '3 days',
    end_offset   => INTERVAL '1 hour',
    schedule_interval => INTERVAL '30 minutes');`}
      </pre>

      <p>
        The dashboard then reads <code>readings_hourly</code>, and a year of data is 8,760 rows per
        device instead of 31 million. The cost stops tracking how long the system has been running
        and starts tracking how much of it you actually asked to see.
      </p>

      <h2>The part people skip</h2>

      <p>
        <strong>The refresh policy is the design.</strong> That <code>end_offset</code> is not
        boilerplate — it is you deciding how stale the dashboard is allowed to be. Set it to an
        hour and the most recent hour is missing from the aggregate entirely, which looks exactly
        like data loss to whoever is watching a live screen.
      </p>

      <p>
        The honest fix is to stop pretending one query can serve both needs: read the aggregate for
        everything older than the offset, read the raw hypertable for the sliver since, and union
        them. TimescaleDB's real-time aggregation does this for you, and it is worth knowing that
        it is doing it — because the moment somebody turns it off to make a query faster, the tail
        of every chart quietly flattens.
      </p>

      <p>
        The second thing people skip: aggregates are not free to keep. They occupy space, the
        refresh job competes for I/O with ingest, and if you define six of them at different
        granularities you have six background jobs writing during your busiest window. One hourly
        rollup that several dashboards share beats a bespoke view per screen.
      </p>

      <h2>Compression is the other half</h2>

      <p>
        Once a chunk is old enough that nobody queries it row by row, it can be compressed in place
        — often to a tenth of the size, with the aggregate still serving the reads:
      </p>

      <pre className="card-solid rounded-xl p-5 text-xs font-mono leading-relaxed overflow-x-auto text-foreground/80 my-6">
{`ALTER TABLE readings SET (
    timescaledb.compress,
    timescaledb.compress_segmentby = 'device_id',
    timescaledb.compress_orderby   = 'recorded_at DESC'
);

SELECT add_compression_policy('readings', INTERVAL '14 days');`}
      </pre>

      <p>
        <code>compress_segmentby</code> is the one to get right. Segment by the column you filter
        on and compressed chunks stay selectively readable; get it wrong and every query has to
        decompress far more than it needs. It is the same instinct as choosing an index — you are
        telling the database which question you plan to ask.
      </p>

      <h2>The general shape</h2>

      <p>
        Time-series work rewards deciding, once and explicitly, what resolution each question
        actually needs. Nobody looking at a year of data wants per-second readings; they want a
        shape. Storing the raw rows and recomputing that shape on every page load is doing the same
        arithmetic thousands of times to produce an answer that never changes.
      </p>
    </NoteLayout>
  );
}
