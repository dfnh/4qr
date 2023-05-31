import { type GetStaticPropsContext } from 'next';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { LoadingSpinner2 } from '~/components/Spinner';

const ProfileList = dynamic(() => import('~/modules/ProfileList'), {
  ssr: false,
});

const ProfilePage = () => {
  const t = useTranslations('ProfilePage');
  const router = useRouter();
  const { data: session, status } = useSession();
  if (status !== 'authenticated') {
    if (status === 'unauthenticated') {
      router
        .replace(
          {
            pathname: '/auth/signin',
            query: {
              callbackUrl: `${router?.locale ? `/${router?.locale}` : ''}${
                router.asPath
              }`,
            },
          },
          '/auth/signin'
        )
        .catch((e) => console.error(e));
    }
    return (
      <div className="absolute left-1/2 -translate-x-1/2">
        <LoadingSpinner2 className="mt-2" />
      </div>
    );
  }
  return (
    <>
      <Head>
        <title>{t('head.title')}</title>
      </Head>
      <main className="container flex flex-col py-6">
        <h1 className="mb-5 truncate text-center text-3xl font-semibold tracking-tight">
          {t('title', { user: session?.user?.name ?? session?.user?.email })}
        </h1>

        <ProfileList />
      </main>
    </>
  );
};

export default ProfilePage;

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const messages = await (await import('~/utils/nextIntl')).default(context);
  return { props: { messages: messages } };
};
