/**
 * POST /api/contact — Cloudflare Pages Function.
 *
 * Runs on the Workers runtime, deployed alongside the static site. There is no
 * server to keep alive: it is cold until a request arrives and gone a few
 * milliseconds later.
 *
 * The Resend key lives in `env`, never in this file or anywhere else in the
 * repo. Set it once with:
 *   wrangler pages secret put RESEND_API_KEY
 * or in the Cloudflare dashboard under Settings → Environment variables, as an
 * *encrypted* variable. For local dev, put it in .dev.vars (gitignored).
 *
 * Every exit is a JSON response carrying a `code`. Nothing is allowed to throw
 * out of the handler: an uncaught error here becomes an opaque Cloudflare 502
 * HTML page, which tells the sender nothing and tells me less.
 */

const TO = 'yousef@selawii.com';
// Must be a domain verified in Resend, otherwise the send is rejected.
const FROM = 'Portfolio <contact@selawii.com>';

const LIMITS = { name: 100, email: 200, message: 5000 };

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

/** Escaped before it ever reaches the email HTML — the body is attacker-controlled. */
const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

function validate(data) {
  const errors = {};
  const name = (data.name ?? '').trim();
  const email = (data.email ?? '').trim();
  const message = (data.message ?? '').trim();

  if (!name) errors.name = 'Please tell me your name.';
  else if (name.length > LIMITS.name) errors.name = 'That name is too long.';

  if (!email) errors.email = 'I need an address to reply to.';
  else if (email.length > LIMITS.email) errors.email = 'That address is too long.';
  // Deliberately loose: the only real test of an address is sending to it.
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "That doesn't look like an email address.";

  if (!message) errors.message = 'The message is empty.';
  else if (message.length > LIMITS.message) errors.message = 'That message is too long to send.';

  return { errors, clean: { name, email, message } };
}

async function handle({ request, env }) {
  if (!env.RESEND_API_KEY) {
    console.error('[contact] RESEND_API_KEY is not set on this environment');
    return json(500, {
      code: 'no_key',
      error: "The form isn't configured yet. Email me directly instead.",
    });
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return json(400, { code: 'bad_json', error: 'Malformed request.' });
  }
  // `JSON.parse("null")` is null, and reading a property off it would throw.
  if (data === null || typeof data !== 'object') {
    return json(400, { code: 'bad_json', error: 'Malformed request.' });
  }

  // Honeypot: a field hidden from humans. Anything that fills it is a bot, and
  // gets a cheerful 200 so it has no signal to tune against.
  if (data.company) return json(200, { ok: true });

  const { errors, clean } = validate(data);
  if (Object.keys(errors).length) return json(422, { code: 'invalid', errors });

  let res;
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        // So replying in the mail client goes straight back to them.
        reply_to: clean.email,
        subject: `Portfolio — ${clean.name}`,
        html: `
          <p><strong>From:</strong> ${escapeHtml(clean.name)} &lt;${escapeHtml(clean.email)}&gt;</p>
          <hr />
          <p style="white-space:pre-wrap">${escapeHtml(clean.message)}</p>
        `,
        text: `From: ${clean.name} <${clean.email}>\n\n${clean.message}`,
      }),
    });
  } catch (err) {
    // Couldn't reach Resend at all. Left uncaught this became a Cloudflare 502.
    console.error('[contact] fetch to Resend threw:', err?.stack ?? String(err));
    return json(502, {
      code: 'upstream_unreachable',
      error: "Couldn't reach the mail service. Email me directly instead.",
    });
  }

  if (!res.ok) {
    // Log the upstream detail, return none of it — it can carry account info.
    let detail = '';
    try {
      detail = await res.text();
    } catch {
      detail = '(body unreadable)';
    }
    console.error('[contact] Resend rejected the send', res.status, detail);
    return json(502, {
      code: 'upstream_rejected',
      error: "That didn't send. Try again, or email me directly.",
    });
  }

  return json(200, { ok: true });
}

export async function onRequestPost(context) {
  try {
    return await handle(context);
  } catch (err) {
    // The last line of defence. Anything reaching here would otherwise surface
    // as a Cloudflare error page with no explanation on either side.
    console.error('[contact] unhandled:', err?.stack ?? String(err));
    return json(500, {
      code: 'unhandled',
      error: 'Something broke on my side. Email me directly instead.',
    });
  }
}
