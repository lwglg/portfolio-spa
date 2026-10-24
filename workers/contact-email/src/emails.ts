/**
 * E-mail builders for the contact Worker.
 * Confirmation HTML comes from the shared ConfirmationEmailTemplate pipeline
 * (`src/lib/confirmationEmailHtml.ts` + i18n locale strings).
 */
import enGB from '../../../src/i18n/locales/en-GB.json';
import ptBR from '../../../src/i18n/locales/pt-BR.json';
import {
  buildConfirmationEmailHtml,
  getConfirmationEmailCopy,
} from '../../../src/lib/confirmationEmailHtml';

export interface ContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  organisation?: string;
  countryCode: string;
  phone?: string;
  message: string;
  locale?: string;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const neoShell = (inner: string) =>
  `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:24px;background:#f7f0d4;font-family:system-ui,sans-serif;">
  <div style="max-width:560px;margin:0 auto;border:3px solid #000;box-shadow:6px 6px 0 #000;background:#fbf6e3;color:#000;">
    <div style="background:#ffdb33;border-bottom:3px solid #000;padding:16px 24px;font-weight:900;font-size:20px;">
      Guilherme Gonçalves
    </div>
    <div style="padding:24px;line-height:1.6;">
      ${inner}
    </div>
  </div>
</body>
</html>
`.trim();

/** Notification to portfolio owner */
export function buildOwnerNotificationHtml(data: ContactPayload): string {
  const phone = data.phone && data.phone.trim() ? `${data.countryCode} ${data.phone}` : '—';
  const org = data.organisation?.trim() || '—';

  return neoShell(`
    <p style="font-weight:700;margin:0 0 12px;">Nova mensagem de contacto</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:4px 0;font-weight:700;">Nome</td><td>${escapeHtml(`${data.firstName} ${data.lastName}`)}</td></tr>
      <tr><td style="padding:4px 0;font-weight:700;">E-mail</td><td>${escapeHtml(data.email)}</td></tr>
      <tr><td style="padding:4px 0;font-weight:700;">Organização</td><td>${escapeHtml(org)}</td></tr>
      <tr><td style="padding:4px 0;font-weight:700;">Telefone</td><td>${escapeHtml(phone)}</td></tr>
    </table>
    <p style="font-weight:700;margin:16px 0 8px;">Mensagem</p>
    <p style="white-space:pre-wrap;margin:0;">${escapeHtml(data.message)}</p>
  `);
}

function localeStrings(locale?: string) {
  const dict = locale === 'en-GB' ? enGB : ptBR;
  return dict.contact.confirmationEmail;
}

/** Confirmation to the visitor — same template as ConfirmationEmailTemplate. */
export function buildConfirmationHtml(data: ContactPayload): string {
  const fullName = `${data.firstName} ${data.lastName}`;
  const copy = getConfirmationEmailCopy(localeStrings(data.locale), fullName);
  return buildConfirmationEmailHtml(copy);
}

export function ownerSubject(data: ContactPayload): string {
  return `[Portfolio] Contacto de ${data.firstName} ${data.lastName}`;
}

export function confirmationSubject(data: ContactPayload): string {
  return localeStrings(data.locale).subject;
}
