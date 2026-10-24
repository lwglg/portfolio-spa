/**
 * Flux actions for the contact form.
 * Posts to Cloudflare Worker (Resend): owner notification + visitor confirmation.
 */
import { CONTACT_API_URL } from '@/constants';
import type { Dictionary } from '@/i18n';
import { useContactStore } from '@/stores/contactStore';
import type { ContactFormData } from '@/types';

export interface ContactApiPayload extends ContactFormData {
  locale: string;
}

/**
 * Submits the contact form to the email Worker.
 * When CONTACT_API_URL is unset (local without Worker), falls back to a mock success
 * so UI can still be exercised offline.
 */
export async function submitContactForm(
  data: ContactFormData,
  dict: Dictionary,
  locale?: string,
): Promise<void> {
  const { submitStart, submitSuccess, submitError } = useContactStore.getState();

  submitStart();

  try {
    if (!CONTACT_API_URL) {
      await mockSubmit(data, dict);
      submitSuccess(data);
      return;
    }

    const payload: ContactApiPayload = {
      ...data,
      locale: locale ?? 'pt-BR',
    };

    const res = await fetch(CONTACT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    let body: { error?: string; ok?: boolean; warning?: string } = {};
    try {
      body = (await res.json()) as typeof body;
    } catch {
      // non-JSON error body
    }

    if (!res.ok) {
      throw new Error(body.error || dict.contact.form.error);
    }

    submitSuccess(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : dict.contact.form.error;
    submitError(message);
    throw err;
  }
}

async function mockSubmit(data: ContactFormData, dict: Dictionary): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const fullName = `${data.firstName} ${data.lastName}`;

  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.info('[Contact] Mock submit (set NEXT_PUBLIC_CONTACT_API_URL to use Worker)', {
      toOwner: 'lwglguilherme@gmail.com',
      confirmationTo: data.email,
      subject: dict.contact.confirmationEmail.subject,
      greeting: dict.contact.confirmationEmail.greeting.replace('{{name}}', fullName),
    });
  }
}
