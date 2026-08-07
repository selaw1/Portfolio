import NoteLayout from '../../components/NoteLayout';
import StreamingDemo from '../../notes/StreamingDemo';
import { noteBySlug } from '../../notes/registry';

export default function StreamingExports() {
  const meta = noteBySlug('streaming-exports')!;

  return (
    <NoteLayout note={meta}>
      <p>
        "Export to CSV" is the most reliably underestimated feature in any admin panel. It gets
        built in an afternoon, works perfectly for a year, and then somebody with a real account
        clicks it and the container dies.
      </p>

      <p>
        The failure isn't the query. It's that the obvious implementation holds the entire result
        in memory before a single byte reaches the client. Drag the row count and watch:
      </p>

      <div className="my-10">
        <StreamingDemo />
        <p className="text-xs text-muted-foreground/70 mt-4 leading-relaxed">
          Modelled from a fixed per-row footprint and a fixed chunk size against a 512 MB
          container. The shape is the real one; the exact ceiling depends on your deployment.
        </p>
      </div>

      <h2>Three copies of the same data</h2>

      <p>
        The version everybody writes first is worse than it looks, because the rows exist several
        times over at the same instant:
      </p>

      <pre className="card-solid rounded-xl p-5 text-xs font-mono leading-relaxed overflow-x-auto text-foreground/80 my-6">
{`rows = list(Reading.objects.filter(...))          # 1. every model instance
data = [serialize(r) for r in rows]                # 2. every dict
body = "\\n".join(",".join(d) for d in data)        # 3. one giant string
return HttpResponse(body, content_type="text/csv")`}
      </pre>

      <p>
        Model instances are the expensive part — Django builds a full Python object per row, with
        all the field descriptors attached. At a million rows you are not holding a million
        readings, you are holding a million objects, then a million dicts, then a string the size
        of the file.
      </p>

      <h2>Never hold more than a chunk</h2>

      <p>
        The fix has two halves, and doing only one of them doesn't work. Stream the response{' '}
        <em>and</em> stream the query — <code>.iterator()</code> with a chunk size so the database
        cursor feeds you batches instead of materialising the result set, and{' '}
        <code>.values_list()</code> so you never build model instances at all:
      </p>

      <pre className="card-solid rounded-xl p-5 text-xs font-mono leading-relaxed overflow-x-auto text-foreground/80 my-6">
{`def rows():
    yield "recorded_at,device_id,value\\n"
    qs = (Reading.objects
          .filter(...)
          .values_list("recorded_at", "device_id", "value")
          .iterator(chunk_size=2000))
    for recorded_at, device_id, value in qs:
        yield f"{recorded_at.isoformat()},{device_id},{value}\\n"

return StreamingHttpResponse(rows(), content_type="text/csv")`}
      </pre>

      <p>
        Now peak memory is a function of the chunk size, not of the export size. A thousand rows
        and a million rows cost the same.
      </p>

      <h2>Where streaming still isn't enough</h2>

      <p>
        Memory was the crash; the timeout is the next wall. A million-row export can outlive any
        sensible proxy limit, and a request that dies at ninety seconds is only marginally better
        than one that dies at OOM — the user still gets nothing, and they still retry.
      </p>

      <p>
        Past a certain size the export stops being a request at all. Hand it to a worker, write
        the object straight to storage as it generates, and give the user back a job they can
        watch:
      </p>

      <pre className="card-solid rounded-xl p-5 text-xs font-mono leading-relaxed overflow-x-auto text-foreground/80 my-6">
{`@shared_task
def export_readings(job_id, filters):
    job = ExportJob.objects.get(pk=job_id)
    # the same generator, piped into object storage instead of a response
    minio.put_object("exports", job.key, StreamAdapter(rows(filters)),
                     length=-1, part_size=10 * 1024 * 1024)
    job.mark_ready(url=minio.presigned_get_object("exports", job.key))`}
      </pre>

      <p>
        Which buys something the synchronous version could never offer: the export survives a
        deploy, the user can close the tab, and a failure is a retryable job rather than a lost
        afternoon.
      </p>

      <h2>The general shape</h2>

      <p>
        The recurring question is <strong>what does peak memory scale with</strong>. If the answer
        is "the size of the user's data", you have a bug with a fuse in it — it works until someone
        succeeds enough to trigger it. Making the answer "a constant" is nearly always a small
        change, and nearly always made after the first incident rather than before.
      </p>
    </NoteLayout>
  );
}
