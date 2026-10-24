/**
 * Template de e-mail de confirmação (neobrutalism).
 * Layout partilhado com `buildConfirmationEmailHtml` (Worker / Resend).
 */
import type { Dictionary } from '@/i18n';
import { getConfirmationEmailCopy } from '@/lib/confirmationEmailHtml';

interface Props {
  fullName: string;
  dict: Dictionary;
}

export function ConfirmationEmailTemplate({ fullName, dict }: Props) {
  const brand =
    'emailBrand' in dict.contact && typeof dict.contact.emailBrand === 'string'
      ? dict.contact.emailBrand
      : 'Guilherme Gonçalves';
  const copy = getConfirmationEmailCopy(dict.contact.confirmationEmail, fullName, brand);

  return (
    <div
      style={{
        fontFamily: 'system-ui, sans-serif',
        maxWidth: 560,
        margin: '0 auto',
        border: '3px solid #000',
        boxShadow: '6px 6px 0 #000',
        background: '#fbf6e3',
        color: '#000',
      }}
    >
      <div
        style={{
          background: '#ffdb33',
          borderBottom: '3px solid #000',
          padding: '16px 24px',
          fontWeight: 900,
          fontSize: 20,
        }}
      >
        {copy.brand ?? brand}
      </div>
      <div style={{ padding: 24 }}>
        <p style={{ fontWeight: 700, marginBottom: 12 }}>{copy.greeting}</p>
        <p style={{ lineHeight: 1.6, marginBottom: 24 }}>{copy.body}</p>
        <p style={{ fontWeight: 700 }}>{copy.footer}</p>
      </div>
    </div>
  );
}

/** Re-export for callers that need the HTML string (e.g. previews). */
export { buildConfirmationEmailHtml, getConfirmationEmailCopy } from '@/lib/confirmationEmailHtml';
