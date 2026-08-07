import { useRef, useState } from 'react';
import { Loader2, Send, Check, AlertCircle } from 'lucide-react';

type Errors = Partial<Record<'name' | 'email' | 'message', string>>;
type Status = 'idle' | 'sending' | 'sent' | 'error';

const LIMITS = { name: 100, email: 200, message: 5000 };

/** Mirrors the server's rules so the first round-trip isn't wasted on a typo. */
function validate(values: { name: string; email: string; message: string }): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = 'Please tell me your name.';
  if (!values.email.trim()) errors.email = 'I need an address to reply to.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "That doesn't look like an email address.";
  if (!values.message.trim()) errors.message = 'The message is empty.';
  return errors;
}

const field =
  'w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus-ring transition-colors duration-200 hover:border-primary/30';

export default function ContactForm() {
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [failure, setFailure] = useState('');
  const honeypot = useRef<HTMLInputElement>(null);

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus('sending');
    setFailure('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...values, company: honeypot.current?.value ?? '' }),
      });
      const body = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus('sent');
        setValues({ name: '', email: '', message: '' });
        return;
      }
      if (body.errors) {
        setErrors(body.errors);
        setStatus('idle');
        return;
      }
      throw new Error(body.error ?? 'Something went wrong.');
    } catch (err) {
      setFailure(err instanceof Error ? err.message : 'Something went wrong.');
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div
        className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-8 text-center"
        role="status"
      >
        <Check className="w-8 h-8 text-emerald-400 mx-auto mb-4" aria-hidden="true" />
        <p className="font-display font-semibold text-foreground text-lg mb-2">Sent.</p>
        <p className="text-sm text-muted-foreground">
          I'll reply to that address. Usually within a day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="text-left">
      {/* Hidden from humans and from screen readers; only bots fill it.
          Parked far off-screen rather than display:none, because the cheaper
          scrapers skip fields they can see are not rendered. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
        <label htmlFor="company">Company (leave this empty)</label>
        <input
          ref={honeypot}
          id="company"
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <Field id="name" label="Name" error={errors.name}>
          <input
            id="name"
            name="name"
            value={values.name}
            onChange={set('name')}
            maxLength={LIMITS.name}
            autoComplete="name"
            placeholder="Your name"
            className={field}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
        </Field>

        <Field id="email" label="Email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={set('email')}
            maxLength={LIMITS.email}
            autoComplete="email"
            placeholder="you@company.com"
            className={field}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
        </Field>
      </div>

      <Field id="message" label="Message" error={errors.message} hint="What are you building?">
        <textarea
          id="message"
          name="message"
          value={values.message}
          onChange={set('message')}
          maxLength={LIMITS.message}
          rows={5}
          placeholder="A few lines is plenty."
          className={`${field} resize-y min-h-[120px]`}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : 'message-hint'}
        />
      </Field>

      {status === 'error' && (
        <p
          className="flex items-start gap-2 mt-4 text-sm text-red-400"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
          {failure}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-6 inline-flex items-center justify-center gap-2 px-6 min-h-[48px] rounded-lg bg-primary text-primary-foreground text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-wait focus-ring cursor-pointer"
      >
        {status === 'sending' ? (
          <>
            <Loader2 className="w-4 h-4 motion-safe:animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            <Send className="w-4 h-4" aria-hidden="true" />
            Send message
          </>
        )}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      {/* A visible label, not a placeholder standing in for one. */}
      <label htmlFor={id} className="text-xs font-mono uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="flex items-start gap-1.5 text-xs text-red-400">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-px" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground/70">{hint}</p>
      ) : null}
    </div>
  );
}
