import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useToast } from '~/hooks/useToast';
import { useZodForm } from '~/hooks/useZodForm';
import { signUpSchema, type SignUpSchema } from '~/schemas/authSchema';
import { useSignInLoadingAtom } from '~/store/auth';
import { Button } from '~/ui/button';
import { api } from '~/utils/api';
import InputWithLabel from './InputWithLabel';

const SignUp = () => {
  const {
    query: { callbackUrl },
  } = useRouter();

  return (
    <div className="container flex max-w-md flex-col gap-4">
      <SignUpForm callbackUrl={callbackUrl as string} />

      <Link href="/auth/signin" className="text-center text-sm font-medium leading-none">
        Already have an account?
      </Link>
    </div>
  );
};

const SignUpForm = ({ callbackUrl }: { callbackUrl?: string }) => {
  const methods = useZodForm({
    schema: signUpSchema,
    mode: 'onChange',
  });

  const { push } = useRouter();
  const [loading, setLoading] = useSignInLoadingAtom();
  const { toast } = useToast();

  const { mutate } = api.user.signUp.useMutation({
    onError(error) {
      setLoading(false);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    },
    onMutate() {
      setLoading(true);
      methods.resetField('confirmPassword');
    },
    onSuccess: async (data) => {
      const result = await signIn('credentials', {
        ...data,
        password: methods.getValues('password'),
        redirect: false,
      });
      if (result?.ok) {
        void push(callbackUrl ?? '/');
        return;
      } else {
        toast({
          variant: 'destructive',
          title: 'Sign in error',
          description: result?.error ?? 'Something went wrong',
        });
        setLoading(false);
      }
    },
  });

  const onSubmit = (data: SignUpSchema) => {
    mutate(data);
  };

  return (
    <form
      className="container flex flex-col gap-4"
      onSubmit={methods.handleSubmit(onSubmit)}
    >
      <InputWithLabel
        id="name"
        labelText="Name"
        type="text"
        register={methods.register('name')}
        error={methods.formState.errors?.name?.message}
      />
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
      <InputWithLabel
        id="confirmPassword"
        labelText="Confirm password"
        type="password"
        register={methods.register('confirmPassword')}
        error={methods.formState.errors?.confirmPassword?.message}
      />
      <Button variant="secondary" type="submit" disabled={loading}>
        Sign up
      </Button>
    </form>
  );
};

export default SignUp;
