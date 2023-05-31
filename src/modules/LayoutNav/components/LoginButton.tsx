import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { buttonVariants } from '~/ui/button';
import { cn } from '~/utils/cn';

const LoginButton = () => {
  const t = useTranslations('UserNav.Auth.LoginButton');
  const router = useRouter();

  return (
    <Link
      href={{
        pathname: '/auth/signin',
        query: {
          callbackUrl: `${router.basePath}/${router.locale || ''}${router.asPath}`,
        },
      }}
      as={'/auth/signin'}
      className={cn(buttonVariants({ variant: 'outline' }))}
      type="button"
    >
      {t('Sign in')}
    </Link>
  );
};

export default LoginButton;
