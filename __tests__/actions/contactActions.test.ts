import { submitContactForm } from '@/actions/contactActions';
import { getDictionary } from '@/i18n';
import { useContactStore } from '@/stores/contactStore';
import type { ContactFormData } from '@/types';

const dict = getDictionary('pt-BR');

const validData: ContactFormData = {
  firstName: 'Guilherme',
  lastName: 'Gonçalves',
  email: 'test@example.com',
  organisation: 'GLG',
  countryCode: '+55',
  phone: '51999999999',
  message: 'Olá, contacto de teste.',
};

describe('submitContactForm', () => {
  beforeEach(() => {
    useContactStore.getState().reset();
    jest.useFakeTimers();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('mock path: idle → submitting → success when API URL is empty', async () => {
    // CONTACT_API_URL is empty in test env unless set
    const promise = submitContactForm(validData, dict, 'pt-BR');
    expect(useContactStore.getState().status).toBe('submitting');

    await jest.advanceTimersByTimeAsync(600);
    await promise;

    const state = useContactStore.getState();
    expect(state.status).toBe('success');
    expect(state.lastSubmitted?.email).toBe(validData.email);
  });

  it('records error when mock path throws', async () => {
    const original = useContactStore.getState().submitSuccess;
    useContactStore.setState({
      submitSuccess: () => {
        throw new Error('boom');
      },
    });

    const promise = submitContactForm(validData, dict, 'pt-BR');
    const expectation = expect(promise).rejects.toThrow('boom');

    await jest.advanceTimersByTimeAsync(600);
    await expectation;

    expect(useContactStore.getState().status).toBe('error');
    expect(useContactStore.getState().errorMessage).toBe('boom');

    useContactStore.setState({ submitSuccess: original });
  });
});
