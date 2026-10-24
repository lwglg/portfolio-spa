import type { EmailMessage } from '@domain/mail/EmailMessage';

/** Outbound port: deliver transactional e-mail. */
export interface MailSender {
  send(message: EmailMessage): Promise<void>;
}

export class MailDeliveryError extends Error {
  constructor(
    message: string,
    readonly detail?: string,
  ) {
    super(message);
    this.name = 'MailDeliveryError';
  }
}
