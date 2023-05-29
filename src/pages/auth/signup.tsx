import { type GetStaticPropsContext } from 'next';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { LoadingSpinner2 } from '~/components/Spinner';
import SignUp from '~/modules/SignUp';

const SignUpPage = () => {
  const t = useTranslations('SignUpPage');
  const { status } = useSession();
  const router = useRouter();
  if (status === 'authenticated') {
    void router.replace('/');
  }
  if (status === 'loading') {
    return <LoadingSpinner2 className="mt-2" />;
  }
  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
      <div className="flex flex-col items-center justify-center gap-6 px-8 py-8">
        <h1 className="text-3xl font-semibold tracking-tight">{t('title')}</h1>
        <SignUp />
      </div>
    </>
  );
};

export default SignUpPage;

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const messages = await (await import('~/utils/nextIntl')).default(context);
  return { props: { messages: messages } };
};
