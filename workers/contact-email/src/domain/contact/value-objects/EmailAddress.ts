import { DomainError } from '@domain/shared/DomainError';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Value object: validated e-mail address. */
export class EmailAddress {
  private constructor(readonly value: string) {}

  static create(raw: string): EmailAddress {
    const value = (raw ?? '').trim();
    if (!value || !EMAIL_RE.test(value)) {
      throw new DomainError('valid email is required', 'INVALID_EMAIL');
    }
    return new EmailAddress(value);
  }

  toString(): string {
    return this.value;
  }
}
