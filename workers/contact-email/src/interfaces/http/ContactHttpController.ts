import { SubmitContactMessage } from '@application/SubmitContactMessage';
import { ContactMessage } from '@domain/contact/ContactMessage';
import { MailDeliveryError } from '@domain/mail/MailSender';
import { DomainError } from '@domain/shared/DomainError';
import { ResendMailSender } from '@infrastructure/resend/ResendMailSender';
import { SharedConfirmationMailComposer } from '@infrastructure/templates/ConfirmationMailComposer';
import { NeoOwnerNotificationComposer } from '@infrastructure/templates/OwnerNotificationComposer';
import { corsHeaders } from '@interfaces/http/cors';
import type { WorkerEnv } from '@interfaces/http/Env';
import { jsonResponse } from '@interfaces/http/httpResponse';

/** Driving adapter: HTTP → application use case. */
export class ContactHttpController {
  handle(request: Request, env: WorkerEnv): Promise<Response> {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin, env.ALLOWED_ORIGINS);

    if (request.method === 'OPTIONS') {
      return Promise.resolve(new Response(null, { status: 204, headers: cors }));
    }

    if (request.method !== 'POST') {
      return Promise.resolve(jsonResponse({ error: 'Method not allowed' }, 405, cors));
    }

    if (!env.RESEND_API_KEY) {
      return Promise.resolve(
        jsonResponse({ error: 'Server misconfigured: missing RESEND_API_KEY' }, 500, cors),
      );
    }

    return this.processPost(request, env, cors);
  }

  private async processPost(
    request: Request,
    env: WorkerEnv,
    cors: HeadersInit,
  ): Promise<Response> {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: 'Invalid JSON body' }, 400, cors);
    }

    let message: ContactMessage;
    try {
      message = ContactMessage.create(body as Record<string, string | undefined>);
    } catch (err) {
      if (err instanceof DomainError) {
        return jsonResponse({ error: err.message, code: err.code }, 400, cors);
      }
      throw err;
    }

    const useCase = new SubmitContactMessage(
      new ResendMailSender(env.RESEND_API_KEY),
      new NeoOwnerNotificationComposer(),
      new SharedConfirmationMailComposer(),
      {
        from: env.MAIL_FROM || 'LWGLG Portfolio SPA <onboarding@resend.dev>',
        toOwner: env.CONTACT_TO_EMAIL || 'lwglguilherme@gmail.com',
      },
    );

    try {
      const result = await useCase.execute(message);
      if (!result.confirmationDelivered) {
        return jsonResponse(
          {
            ok: true,
            warning: result.confirmationWarning,
          },
          200,
          cors,
        );
      }
      return jsonResponse({ ok: true }, 200, cors);
    } catch (err) {
      if (err instanceof MailDeliveryError) {
        return jsonResponse({ error: err.message, detail: err.detail }, 502, cors);
      }
      throw err;
    }
  }
}
