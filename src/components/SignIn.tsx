import { type BuiltInProviderType } from 'next-auth/providers';
import { signIn, type ClientSafeProvider, type LiteralUnion } from 'next-auth/react';
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

type Providers =
  | Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
  | never[];

type SignInProps = { providers: Providers };

const authErrors = new Map([
  [
    'OAuthAccountNotLinked',
    'Email on the account is already linked, but not with this Provider',
  ],
]);

const SignIn = ({ providers }: SignInProps) => {
  const {
    query: { callbackUrl, error },
  } = useRouter();

  const { toast } = useToast();

  const onError = useCallback(
    (err?: string) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err ?? 'Something went wrong',
      });
    },
    [toast]
  );

  return (
    <div className="container flex max-w-md flex-col gap-4">
      {error && (
        <AlertComponent
          title="Error"
          description={authErrors.get(error as string) ?? (error as string)}
        />
      )}

      <SignInForm onError={onError} callbackUrl={callbackUrl as string} />

      <Link href="/auth/signup" className="text-center text-sm font-medium leading-none">
        {`Don't have an account?`}
      </Link>

      <SeparatorWithText text="Or" className="mx-8 mb-1" />

      <ProviderButtons providers={providers} callbackUrl={callbackUrl as string} />
    </div>
  );
};

type SignInCommonProps = { callbackUrl?: string; onError?: (err?: string) => void };
const SignInForm = ({ onError, callbackUrl }: SignInCommonProps) => {
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
        labelText="Email"
        type="email"
        register={methods.register('email')}
        error={methods.formState.errors?.email?.message}
      />
      <InputWithLabel
        id="password"
        labelText="Password"
        type="password"
        register={methods.register('password')}
        error={methods.formState.errors?.password?.message}
      />
      <Button variant="secondary" type="submit" disabled={loading}>
        Sign in
      </Button>
    </form>
  );
};

type ProviderButtonsProps = { providers: Providers } & SignInCommonProps;
const ProviderButtons = memo(({ providers, callbackUrl }: ProviderButtonsProps) => {
  const providersArray = useMemo(() => {
    return Object.values(providers).filter((p) => p.type === 'oauth');
  }, [providers]);

  const [loading, setLoading] = useSignInLoadingAtom();

  const onClick = useCallback(
    (p: ClientSafeProvider) => {
      setLoading(true);
      void signIn(p.id, {
        callbackUrl: `${callbackUrl ?? window.location.origin}`,
      });
    },
    [callbackUrl, setLoading]
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
        />
      ))}
    </div>
  );
});
ProviderButtons.displayName = 'ProviderButtons';

type ProviderButtonProps = {
  provider: ClientSafeProvider;
  onClick: () => void;
  disabled?: boolean;
};
const ProviderButton = memo(
  ({ provider, onClick, disabled = false }: ProviderButtonProps) => {
    return (
      <Button
        variant="secondary"
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="flex h-11 w-full justify-center gap-4"
      >
        <img
          loading="lazy"
          width={24}
          className=""
          src={`https://authjs.dev/img/providers/${provider.name.toLowerCase()}.svg`}
        />
        Sign in with {provider.name}
      </Button>
    );
  }
);
ProviderButton.displayName = 'ProviderButton';

export default SignIn;
