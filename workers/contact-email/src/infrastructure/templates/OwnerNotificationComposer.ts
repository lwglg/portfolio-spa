import type { OwnerNotificationComposer } from '@application/SubmitContactMessage';
import type { ContactMessage } from '@domain/contact/ContactMessage';
import type { EmailMessage } from '@domain/mail/EmailMessage';
import { contactMailStrings } from '@infrastructure/i18n/contactMailLocale';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function neoShell(brand: string, inner: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:24px;background:#f7f0d4;font-family:system-ui,sans-serif;">
  <div style="max-width:560px;margin:0 auto;border:3px solid #000;box-shadow:6px 6px 0 #000;background:#fbf6e3;color:#000;">
    <div style="background:#ffdb33;border-bottom:3px solid #000;padding:16px 24px;font-weight:900;font-size:20px;">
      ${escapeHtml(brand)}
    </div>
    <div style="padding:24px;line-height:1.6;">
      ${inner}
    </div>
  </div>
</body>
</html>
`.trim();
}

/** Infrastructure: owner notification e-mail (i18n via contact.notificationEmail). */
export class NeoOwnerNotificationComposer implements OwnerNotificationComposer {
  compose(message: ContactMessage, from: string, toOwner: string): EmailMessage {
    const contact = contactMailStrings(message.locale);
    const n = contact.notificationEmail;
    const labels = n.labels;
    const empty = n.emptyValue;
    const brand = contact.emailBrand;

    const org = message.organisation?.trim() || empty;
    const phone = message.phone && message.phone.trim() ? message.formattedPhone() : empty;

    const html = neoShell(
      brand,
      `
    <p style="font-weight:700;margin:0 0 12px;">${escapeHtml(n.title)}</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:4px 0;font-weight:700;">${escapeHtml(labels.name)}</td><td>${escapeHtml(message.fullName)}</td></tr>
      <tr><td style="padding:4px 0;font-weight:700;">${escapeHtml(labels.email)}</td><td>${escapeHtml(message.email.value)}</td></tr>
      <tr><td style="padding:4px 0;font-weight:700;">${escapeHtml(labels.organisation)}</td><td>${escapeHtml(org)}</td></tr>
      <tr><td style="padding:4px 0;font-weight:700;">${escapeHtml(labels.phone)}</td><td>${escapeHtml(phone)}</td></tr>
    </table>
    <p style="font-weight:700;margin:16px 0 8px;">${escapeHtml(labels.message)}</p>
    <p style="white-space:pre-wrap;margin:0;">${escapeHtml(message.message)}</p>
  `,
    );

    return {
      from,
      to: [toOwner],
      replyTo: message.email.value,
      subject: n.subject.replace(/\{\{name\}\}/g, message.fullName),
      html,
    };
  }
}
