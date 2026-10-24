/**
 * Cloudflare Worker: contact form → Resend
 * 1) Notify owner (CONTACT_TO_EMAIL)
 * 2) On success, send confirmation to the visitor
 */
import {
  buildConfirmationHtml,
  buildOwnerNotificationHtml,
  confirmationSubject,
  type ContactPayload,
  ownerSubject,
} from './emails';

export interface Env {
  RESEND_API_KEY: string;
  CONTACT_TO_EMAIL: string;
  MAIL_FROM: string;
  ALLOWED_ORIGINS: string;
}

const RESEND_API = 'https://api.resend.com/emails';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin, env.ALLOWED_ORIGINS);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405, cors);
    }

    if (!env.RESEND_API_KEY) {
      return json({ error: 'Server misconfigured: missing RESEND_API_KEY' }, 500, cors);
    }

    let body: ContactPayload;
    try {
      body = (await request.json()) as ContactPayload;
    } catch {
      return json({ error: 'Invalid JSON body' }, 400, cors);
    }

    const validationError = validatePayload(body);
    if (validationError) {
      return json({ error: validationError }, 400, cors);
    }

    const toOwner = env.CONTACT_TO_EMAIL || 'lwglguilherme@gmail.com';
    const from = env.MAIL_FROM || 'Portfolio <onboarding@resend.dev>';

    // 1) Notify owner
    const ownerRes = await sendResend(env.RESEND_API_KEY, {
      from,
      to: [toOwner],
      reply_to: body.email,
      subject: ownerSubject(body),
      html: buildOwnerNotificationHtml(body),
    });

    if (!ownerRes.ok) {
      const detail = await ownerRes.text();
      return json({ error: 'Failed to deliver message to inbox', detail }, 502, cors);
    }

    // 2) Confirmation to visitor (only after owner mail succeeded)
    const confirmRes = await sendResend(env.RESEND_API_KEY, {
      from,
      to: [body.email],
      subject: confirmationSubject(body),
      html: buildConfirmationHtml(body),
    });

    if (!confirmRes.ok) {
      // Owner already notified — report partial success
      const detail = await confirmRes.text();
      return json(
        {
          ok: true,
          warning: 'Message delivered, but confirmation e-mail failed',
          detail,
        },
        200,
        cors,
      );
    }

    return json({ ok: true }, 200, cors);
  },
};

async function sendResend(
  apiKey: string,
  payload: {
    from: string;
    to: string[];
    subject: string;
    html: string;
    reply_to?: string;
  },
): Promise<Response> {
  return fetch(RESEND_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

function validatePayload(data: ContactPayload): string | null {
  if (!data.firstName?.trim()) return 'firstName is required';
  if (!data.lastName?.trim()) return 'lastName is required';
  if (!data.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return 'valid email is required';
  }
  if (!data.message?.trim()) return 'message is required';
  if (data.message.length > 1000) return 'message is too long';
  return null;
}

function corsHeaders(origin: string, allowedCsv: string): HeadersInit {
  const allowed = (allowedCsv || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const allowOrigin =
    allowed.length === 0 ? origin || '*' : allowed.includes(origin) ? origin : allowed[0];

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(data: unknown, status: number, cors: HeadersInit): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...cors,
      'Content-Type': 'application/json',
    },
  });
}
