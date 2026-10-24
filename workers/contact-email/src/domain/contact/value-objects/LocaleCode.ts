export type SupportedLocale = 'pt-BR' | 'en-GB';

/** Value object: UI / e-mail locale. */
export class LocaleCode {
  private constructor(readonly value: SupportedLocale) {}

  static create(raw?: string): LocaleCode {
    if (raw === 'en-GB') return new LocaleCode('en-GB');
    return new LocaleCode('pt-BR');
  }

  isEnglish(): boolean {
    return this.value === 'en-GB';
  }
}
