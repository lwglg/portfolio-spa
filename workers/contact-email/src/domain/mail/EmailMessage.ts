/** Outbound e-mail to be delivered by a MailSender port. */
export interface EmailMessage {
  from: string;
  to: string[];
  subject: string;
  html: string;
  replyTo?: string;
}
