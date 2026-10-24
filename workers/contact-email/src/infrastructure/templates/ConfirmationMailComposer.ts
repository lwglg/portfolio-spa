import type { ConfirmationMailComposer } from '@application/SubmitContactMessage';
import type { ContactMessage } from '@domain/contact/ContactMessage';
import type { EmailMessage } from '@domain/mail/EmailMessage';
import { contactMailStrings } from '@infrastructure/i18n/contactMailLocale';
import {
  buildConfirmationEmailHtml,
  getConfirmationEmailCopy,
} from '@portfolio/lib/confirmationEmailHtml';

/** Infrastructure: confirmation e-mail (i18n via contact.confirmationEmail). */
export class SharedConfirmationMailComposer implements ConfirmationMailComposer {
  compose(message: ContactMessage, from: string): EmailMessage {
    const contact = contactMailStrings(message.locale);
    const copy = getConfirmationEmailCopy(
      contact.confirmationEmail,
      message.fullName,
      contact.emailBrand,
    );
    const html = buildConfirmationEmailHtml(copy);

    return {
      from,
      to: [message.email.value],
      subject: copy.subject,
      html,
    };
  }
}
