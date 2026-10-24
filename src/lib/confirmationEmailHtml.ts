/**
 * Single source of truth for the confirmation e-mail HTML
 * (neobrutalism layout shared with ConfirmationEmailTemplate).
 */

export interface ConfirmationEmailCopy {
  /** Already substituted greeting, e.g. "Olá Maria," */
  greeting: string;
  body: string;
  footer: string;
  /** Header brand line */
  brand?: string;
}

export interface ConfirmationEmailStrings {
  subject: string;
  greeting: string;
  body: string;
  footer: string;
}

const DEFAULT_BRAND = 'Guilherme Gonçalves';

/** Resolve copy from i18n confirmationEmail block + recipient name. */
export function getConfirmationEmailCopy(
  strings: ConfirmationEmailStrings,
  fullName: string,
  brand: string = DEFAULT_BRAND,
): ConfirmationEmailCopy & { subject: string } {
  return {
    subject: strings.subject,
    greeting: strings.greeting.replace(/\{\{name\}\}/g, fullName),
    body: strings.body,
    footer: strings.footer,
    brand,
  };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Inner card HTML — matches ConfirmationEmailTemplate layout.
 * Safe for e-mail clients (inline styles only).
 */
export function buildConfirmationEmailCardHtml(copy: ConfirmationEmailCopy): string {
  const brand = escapeHtml(copy.brand ?? DEFAULT_BRAND);
  return `
<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;border:3px solid #000;box-shadow:6px 6px 0 #000;background:#fbf6e3;color:#000;">
  <div style="background:#ffdb33;border-bottom:3px solid #000;padding:16px 24px;font-weight:900;font-size:20px;">
    ${brand}
  </div>
  <div style="padding:24px;">
    <p style="font-weight:700;margin:0 0 12px;">${escapeHtml(copy.greeting)}</p>
    <p style="line-height:1.6;margin:0 0 24px;">${escapeHtml(copy.body)}</p>
    <p style="font-weight:700;margin:0;">${escapeHtml(copy.footer)}</p>
  </div>
</div>
`.trim();
}

/** Full HTML document for transactional e-mail providers (Resend, etc.). */
export function buildConfirmationEmailHtml(copy: ConfirmationEmailCopy): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:24px;background:#f7f0d4;">
  ${buildConfirmationEmailCardHtml(copy)}
</body>
</html>
`.trim();
}
