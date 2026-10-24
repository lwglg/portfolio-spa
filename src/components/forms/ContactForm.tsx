'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { submitContactForm } from '@/actions/contactActions';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Spinner';
import { Textarea } from '@/components/ui/Textarea';
import { COUNTRY_CODES, DEFAULT_COUNTRY_CODE } from '@/constants';
import { getDictionary } from '@/i18n';
import { formatPhoneByCountry, isPhoneInputChar, phonePlaceholder } from '@/lib/phoneMask';
import { createContactSchema } from '@/schemas/contactSchema';
import { useContactStore } from '@/stores/contactStore';
import { useLocaleStore } from '@/stores/localeStore';
import type { ContactFormData } from '@/types';

export function ContactForm() {
  const locale = useLocaleStore((s) => s.locale);
  const dict = getDictionary(locale);
  const status = useContactStore((s) => s.status);
  const errorMessage = useContactStore((s) => s.errorMessage);
  const reset = useContactStore((s) => s.reset);

  const schema = createContactSchema(dict);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    reset: resetForm,
  } = useForm<ContactFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      organisation: '',
      countryCode: DEFAULT_COUNTRY_CODE,
      phone: '',
      message: '',
    },
  });

  const countryCode = watch('countryCode') || DEFAULT_COUNTRY_CODE;
  const phoneValue = watch('phone') || '';

  // Re-apply mask when country changes
  useEffect(() => {
    if (!phoneValue) return;
    const next = formatPhoneByCountry(countryCode, phoneValue);
    if (next !== phoneValue) {
      setValue('phone', next, { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on country change
  }, [countryCode]);

  const onSubmit = async (data: ContactFormData) => {
    try {
      await submitContactForm(data, dict, locale);
      resetForm();
    } catch {
      // error already in store
    }
  };

  if (status === 'success') {
    return (
      <Card className="mx-auto max-w-lg shadow-none">
        <CardHeader>
          <CardTitle>{dict.contact.form.success}</CardTitle>
        </CardHeader>
        <CardContent>
          <Button type="button" onClick={reset}>
            {dict.contact.form.submit}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-lg shadow-none">
      <CardHeader>
        <CardTitle>{dict.contact.title}</CardTitle>
        <CardDescription>{dict.contact.subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName">{dict.contact.form.firstName}</Label>
              <Input id="firstName" {...register('firstName')} aria-invalid={!!errors.firstName} />
              {errors.firstName && (
                <p className="mt-1 text-xs text-destructive">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">{dict.contact.form.lastName}</Label>
              <Input id="lastName" {...register('lastName')} aria-invalid={!!errors.lastName} />
              {errors.lastName && (
                <p className="mt-1 text-xs text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email">{dict.contact.form.email}</Label>
            <Input id="email" type="email" {...register('email')} aria-invalid={!!errors.email} />
            {errors.email && (
              <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="organisation">{dict.contact.form.organisation}</Label>
            <Input id="organisation" {...register('organisation')} />
            {errors.organisation && (
              <p className="mt-1 text-xs text-destructive">{errors.organisation.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-[minmax(9.5rem,11rem)_1fr]">
            <div>
              <Label htmlFor="countryCode">{dict.contact.form.countryCode}</Label>
              <Controller
                name="countryCode"
                control={control}
                render={({ field }) => (
                  <Select
                    id="countryCode"
                    options={COUNTRY_CODES}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                )}
              />
            </div>
            <div>
              <Label htmlFor="phone">{dict.contact.form.phone}</Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    placeholder={phonePlaceholder(countryCode)}
                    value={field.value ?? ''}
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    onKeyDown={(e) => {
                      // Allow navigation / edit keys
                      if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) {
                        return;
                      }
                      if (!isPhoneInputChar(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const masked = formatPhoneByCountry(countryCode, e.target.value);
                      field.onChange(masked);
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const text = e.clipboardData.getData('text');
                      const masked = formatPhoneByCountry(countryCode, text);
                      field.onChange(masked);
                    }}
                  />
                )}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="message">{dict.contact.form.message}</Label>
            <Textarea
              id="message"
              rows={5}
              {...register('message')}
              aria-invalid={!!errors.message}
            />
            {errors.message && (
              <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>
            )}
          </div>

          {status === 'error' && errorMessage && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}

          <Button type="submit" disabled={status === 'submitting'} className="w-full">
            {status === 'submitting' ? (
              <span className="inline-flex items-center gap-2">
                <Spinner size="sm" />
                {dict.contact.form.submitting}
              </span>
            ) : (
              dict.contact.form.submit
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
