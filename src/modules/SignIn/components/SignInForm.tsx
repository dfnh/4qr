import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import InputWithLabel from '~/components/InputWithLabel';
import { useZodForm } from '~/hooks/useZodForm';
import { signInSchema, type SignInSchema } from '~/schemas/authSchema';
import { useSignInLoadingAtom } from '~/store/auth';
import { Button } from '~/ui/button';
import { type SignInCommonProps } from '../types';

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

export default SignInForm;
