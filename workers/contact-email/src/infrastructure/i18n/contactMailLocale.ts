import type { LocaleCode } from '@domain/contact/value-objects/LocaleCode';
import enGB from '@portfolio/i18n/locales/en-GB.json';
import ptBR from '@portfolio/i18n/locales/pt-BR.json';

export type ContactMailLocale = typeof ptBR.contact;

export function contactMailStrings(locale: LocaleCode): ContactMailLocale {
  return locale.value === 'en-GB' ? enGB.contact : ptBR.contact;
}
