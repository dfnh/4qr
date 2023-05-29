import { type GetServerSidePropsContext, type InferGetServerSidePropsType } from 'next';
import { getProviders, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { LoadingSpinner2 } from '~/components/Spinner';
import SignIn from '~/modules/SignIn';

type SignInPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;
const SignInPage = ({ providers }: SignInPageProps) => {
  const t = useTranslations('SignInPage');
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
        <title>{t('title')}</title>
      </Head>
      <div className="flex flex-col items-center justify-center gap-6 px-8 py-8">
        <h1 className="text-3xl font-semibold tracking-tight">{t('title')}</h1>
        <SignIn providers={providers} />
      </div>
    </>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const providers = await getProviders();
  const messages = await (await import('~/utils/nextIntl')).default(context);
  return { props: { providers: providers ?? [], messages: messages } };
};

export default SignInPage;
