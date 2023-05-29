import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SignUpForm from './SignUpForm';

const SignUp = () => {
  const t = useTranslations('SignUpPage.SignUp');
  const {
    query: { callbackUrl },
  } = useRouter();

  return (
    <div className="container flex max-w-md flex-col gap-4">
      <SignUpForm callbackUrl={callbackUrl as string} />
      <Link href="/auth/signin" className="text-center text-sm font-medium leading-none">
        {t('to signin')}
      </Link>
    </div>
  );
};

export default SignUp;
