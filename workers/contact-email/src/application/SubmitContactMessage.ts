import type { ContactMessage } from '@domain/contact/ContactMessage';
import type { EmailMessage } from '@domain/mail/EmailMessage';
import type { MailSender } from '@domain/mail/MailSender';
import { MailDeliveryError } from '@domain/mail/MailSender';

/** Port: builds owner-notification e-mail from a contact aggregate. */
export interface OwnerNotificationComposer {
  compose(message: ContactMessage, from: string, toOwner: string): EmailMessage;
}

/** Port: builds visitor confirmation e-mail from a contact aggregate. */
export interface ConfirmationMailComposer {
  compose(message: ContactMessage, from: string): EmailMessage;
}

export interface SubmitContactMessageResult {
  ownerDelivered: true;
  confirmationDelivered: boolean;
  confirmationWarning?: string;
}

/**
 * Application service (use case):
 * 1) Notify portfolio owner
 * 2) On success, send confirmation to the visitor
 */
export class SubmitContactMessage {
  constructor(
    private readonly mailSender: MailSender,
    private readonly ownerComposer: OwnerNotificationComposer,
    private readonly confirmationComposer: ConfirmationMailComposer,
    private readonly config: { from: string; toOwner: string },
  ) {}

  async execute(message: ContactMessage): Promise<SubmitContactMessageResult> {
    const ownerMail = this.ownerComposer.compose(message, this.config.from, this.config.toOwner);

    try {
      await this.mailSender.send(ownerMail);
    } catch (err) {
      const detail = err instanceof MailDeliveryError ? err.detail : undefined;
      throw new MailDeliveryError('Failed to deliver message to inbox', detail);
    }

    const confirmationMail = this.confirmationComposer.compose(message, this.config.from);

    try {
      await this.mailSender.send(confirmationMail);
      return { ownerDelivered: true, confirmationDelivered: true };
    } catch (err) {
      const detail = err instanceof MailDeliveryError ? err.detail : undefined;
      const base = 'Message delivered, but confirmation e-mail failed';
      return {
        ownerDelivered: true,
        confirmationDelivered: false,
        confirmationWarning: detail ? `${base}: ${detail}` : base,
      };
    }
  }
}
