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

export async function onRequestPost({ request, env }) {
  if (!env.RESEND_API_KEY) {
    // Configuration problem, not the sender's problem — say so without detail.
    console.error('RESEND_API_KEY is not set on this environment');
    return json(500, { error: "The form isn't configured yet. Email me directly instead." });
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return json(400, { error: 'Malformed request.' });
  }

  // Honeypot: a field hidden from humans. Anything that fills it is a bot, and
  // gets a cheerful 200 so it has no signal to tune against.
  if (data.company) return json(200, { ok: true });

  const { errors, clean } = validate(data);
  if (Object.keys(errors).length) return json(422, { errors });

  const res = await fetch('https://api.resend.com/emails', {
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

  if (!res.ok) {
    // Log the upstream detail, return none of it — it can carry account info.
    console.error('Resend rejected the send', res.status, await res.text());
    return json(502, { error: "That didn't send. Try again, or email me directly." });
  }

  return json(200, { ok: true });
}

/** Anything other than POST. */
export async function onRequest() {
  return json(405, { error: 'Method not allowed.' });
}
