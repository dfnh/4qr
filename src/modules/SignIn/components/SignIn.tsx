import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import AlertComponent from '~/components/AlertComponent';
import SeparatorWithText from '~/components/SeparatorWithText';
import { useToast } from '~/hooks/useToast';
import { type Providers } from '../types/Providers';
import SignInForm from './SignInForm';

const ProviderButtons = dynamic(() => import('./ProviderButtons'));

type SignInProps = { providers: Providers };

const SignIn = ({ providers }: SignInProps) => {
  const t = useTranslations('SignInPage.SignIn');
  const {
    query: { callbackUrl, error },
    locale,
  } = useRouter();
  const { toast } = useToast();

  const onError = useCallback(
    (err?: string) => {
      const errorProvider = err?.includes(':') ? err.substring(err.indexOf(':') + 1) : '';
      const error = err?.includes(':') ? err.substring(0, err.indexOf(':')) : err;
      toast({
        variant: 'destructive',
        title: t('toast.onError.title'),
        description: t('toast.onError.description', { error: error }) + errorProvider,
      });
    },
    [t, toast]
  );

  const callback = useMemo(
    () =>
      Array.isArray(callbackUrl)
        ? callbackUrl.shift()
        : callbackUrl ?? `/${locale ?? ''}`,
    [callbackUrl, locale]
  );

  return (
    <div className="container flex max-w-md flex-col gap-4">
      {error && (
        <AlertComponent
          title={t('toast.onError.title')}
          description={t('authErrors', { error: error as string })}
        />
      )}
      <SignInForm onError={onError} callbackUrl={callback} />
      <Link href="/auth/signup" className="text-center text-sm font-medium leading-none">
        {t('to signup')}
      </Link>
      <SeparatorWithText text={t('SeparatorWithText')} className="mx-8 mb-1" />
      <ProviderButtons providers={providers} callbackUrl={callback} />
    </div>
  );
};

export default SignIn;
