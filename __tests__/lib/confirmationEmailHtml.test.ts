import { getDictionary } from '@/i18n';
import {
  buildConfirmationEmailCardHtml,
  buildConfirmationEmailHtml,
  getConfirmationEmailCopy,
} from '@/lib/confirmationEmailHtml';

describe('confirmationEmailHtml', () => {
  const dict = getDictionary('pt-BR');
  const strings = dict.contact.confirmationEmail;

  it('substitutes name in greeting', () => {
    const copy = getConfirmationEmailCopy(strings, 'Ana Silva');
    expect(copy.greeting).toContain('Ana Silva');
    expect(copy.greeting).not.toContain('{{name}}');
  });

  it('builds HTML with neobrutalism structure', () => {
    const copy = getConfirmationEmailCopy(strings, 'Ana');
    const html = buildConfirmationEmailHtml(copy);
    expect(html).toContain('Guilherme Gonçalves');
    expect(html).toContain(copy.greeting);
    expect(html).toContain(copy.body);
    expect(html).toContain(copy.footer);
    expect(html).toContain('#ffdb33');
  });

  it('card HTML is embeddable without document wrapper', () => {
    const copy = getConfirmationEmailCopy(strings, 'Bob');
    const card = buildConfirmationEmailCardHtml(copy);
    expect(card).toContain('Bob');
    expect(card).not.toContain('<!DOCTYPE');
  });
});
