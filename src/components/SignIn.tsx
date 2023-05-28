import { type BuiltInProviderType } from 'next-auth/providers';
import { signIn, type ClientSafeProvider, type LiteralUnion } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { memo, useCallback, useMemo } from 'react';
import { useToast } from '~/hooks/useToast';
import { useZodForm } from '~/hooks/useZodForm';
import { signInSchema, type SignInSchema } from '~/schemas/authSchema';
import { useSignInLoadingAtom } from '~/store/auth';
import { Button } from '~/ui/button';
import AlertComponent from './AlertComponent';
import InputWithLabel from './InputWithLabel';
import SeparatorWithText from './SeparatorWithText';
import { useTranslations } from 'next-intl';

type Providers =
  | Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
  | never[];
type SignInProps = { providers: Providers };

// const authErrors = new Map([[ 'OAuthAccountNotLinked',   'Email on the account is already linked, but not with this Provider', ], ]);

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

type SignInCommonProps = { callbackUrl?: string; onError?: (err?: string) => void };
const SignInForm = ({ onError, callbackUrl }: SignInCommonProps) => {
  const t = useTranslations('SignInPage.SignIn.SignInForm');
  const methods = useZodForm({
    schema: signInSchema,
    mode: 'onChange',
  });
  const { push } = useRouter();
  const [loading, setLoading] = useSignInLoadingAtom();

  const onSubmit = async (data: SignInSchema) => {
    setLoading(true);
    const result = await signIn('credentials', {
      ...data,
      redirect: false,
    });
    methods.resetField('password');
    if (result?.ok) {
      void push(callbackUrl ?? '/');
      return;
    } else {
      onError?.(result?.error);
      setLoading(false);
    }
  };

  return (
    <form
      className="container flex flex-col gap-4"
      onSubmit={methods.handleSubmit(onSubmit)}
    >
      <InputWithLabel
        id="email"
        labelText={t('Email')}
        type="email"
        register={methods.register('email')}
        error={methods.formState.errors?.email?.message}
      />
      <InputWithLabel
        id="password"
        labelText={t('Password')}
        type="password"
        register={methods.register('password')}
        error={methods.formState.errors?.password?.message}
      />
      <Button variant="secondary" type="submit" disabled={loading}>
        {t('Sign in')}
      </Button>
    </form>
  );
};

type ProviderButtonsProps = { providers: Providers } & SignInCommonProps;
const ProviderButtons = memo(({ providers, callbackUrl }: ProviderButtonsProps) => {
  const t = useTranslations('SignInPage.SignIn.ProviderButton');
  const providersArray = useMemo(() => {
    return Object.values(providers).filter((p) => p.type === 'oauth');
  }, [providers]);
  const [loading, setLoading] = useSignInLoadingAtom();

  const onClick = useCallback(
    (p: ClientSafeProvider) => {
      // setLoading(true);
      //todo huh??
      void signIn(p.id, {
        callbackUrl: `${callbackUrl ?? window.location.origin}`,
      });
    },
    [callbackUrl]
    // [callbackUrl, setLoading]
  );
  const handleClick = useCallback(
    (p: ClientSafeProvider) => {
      return () => onClick(p);
    },
    [onClick]
  );

  return (
    <div className="container flex flex-col items-center gap-2">
      {providersArray.map((p) => (
        <ProviderButton
          key={p.id}
          provider={p}
          disabled={loading}
          onClick={handleClick(p)}
          title={t('Sign in with', { name: p.name })}
        />
      ))}
    </div>
  );
});
ProviderButtons.displayName = 'ProviderButtons';

type ProviderButtonProps = {
  provider: ClientSafeProvider;
  onClick: () => void;
  title: string;
  disabled?: boolean;
};
const ProviderButton = memo(
  ({ provider, onClick, title, disabled = false }: ProviderButtonProps) => {
    return (
      <Button
        variant="secondary"
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="flex h-11 w-full justify-center gap-4"
      >
        <Image
          loading="lazy"
          width={24}
          height={24}
          className=""
          alt={provider.id}
          src={`https://authjs.dev/img/providers/${provider.name.toLowerCase()}.svg`}
        />
        {title}
      </Button>
    );
  }
);
ProviderButton.displayName = 'ProviderButton';

export default SignIn;
