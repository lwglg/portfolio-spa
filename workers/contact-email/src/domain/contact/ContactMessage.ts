import { EmailAddress } from '@domain/contact/value-objects/EmailAddress';
import { LocaleCode } from '@domain/contact/value-objects/LocaleCode';
import { DomainError } from '@domain/shared/DomainError';

export interface ContactMessageProps {
  firstName: string;
  lastName: string;
  email: EmailAddress;
  organisation?: string;
  countryCode: string;
  phone?: string;
  message: string;
  locale: LocaleCode;
}

/** Aggregate root: a contact form submission. */
export class ContactMessage {
  private constructor(private readonly props: ContactMessageProps) {}

  static create(input: {
    firstName?: string;
    lastName?: string;
    email?: string;
    organisation?: string;
    countryCode?: string;
    phone?: string;
    message?: string;
    locale?: string;
  }): ContactMessage {
    const firstName = (input.firstName ?? '').trim();
    const lastName = (input.lastName ?? '').trim();
    const message = (input.message ?? '').trim();
    const countryCode = (input.countryCode ?? '').trim() || '+55';

    if (!firstName) throw new DomainError('firstName is required', 'INVALID_FIRST_NAME');
    if (!lastName) throw new DomainError('lastName is required', 'INVALID_LAST_NAME');
    if (!message) throw new DomainError('message is required', 'INVALID_MESSAGE');
    if (message.length > 1000) {
      throw new DomainError('message is too long', 'MESSAGE_TOO_LONG');
    }

    return new ContactMessage({
      firstName,
      lastName,
      email: EmailAddress.create(input.email ?? ''),
      organisation: input.organisation?.trim() || undefined,
      countryCode,
      phone: input.phone?.trim() || undefined,
      message,
      locale: LocaleCode.create(input.locale),
    });
  }

  get firstName(): string {
    return this.props.firstName;
  }
  get lastName(): string {
    return this.props.lastName;
  }
  get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`;
  }
  get email(): EmailAddress {
    return this.props.email;
  }
  get organisation(): string | undefined {
    return this.props.organisation;
  }
  get countryCode(): string {
    return this.props.countryCode;
  }
  get phone(): string | undefined {
    return this.props.phone;
  }
  get message(): string {
    return this.props.message;
  }
  get locale(): LocaleCode {
    return this.props.locale;
  }

  formattedPhone(): string {
    if (!this.props.phone) return '—';
    return `${this.props.countryCode} ${this.props.phone}`;
  }
}
