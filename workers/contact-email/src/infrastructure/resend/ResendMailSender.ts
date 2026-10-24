import type { EmailMessage } from '@domain/mail/EmailMessage';
import type { MailSender } from '@domain/mail/MailSender';
import { MailDeliveryError } from '@domain/mail/MailSender';

const RESEND_API = 'https://api.resend.com/emails';

/** Infrastructure adapter: Resend HTTP API. */
export class ResendMailSender implements MailSender {
  constructor(private readonly apiKey: string) {}

  async send(message: EmailMessage): Promise<void> {
    const res = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: message.from,
        to: message.to,
        subject: message.subject,
        html: message.html,
        ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      throw new MailDeliveryError('Resend API error', detail);
    }
  }
}
