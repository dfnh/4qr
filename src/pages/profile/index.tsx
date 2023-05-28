import {
  type GetStaticPropsContext,
  // type GetServerSidePropsContext,
  // type InferGetServerSidePropsType,
} from 'next'; // type GetServerSideProps,
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { LoadingSpinner2 } from '~/components/Spinner';
// import { getBaseUrl } from '~/helpers/getBaseUrl';
// import { getServerAuthSession } from '~/server/auth';

const LazyProfileQrList = dynamic(() => import('~/components/ProfileQrList'), {
  ssr: false,
});

// type ProfilePageProps = InferGetServerSidePropsType<typeof getServerSideProps>;
// const ProfilePage = ({ user }: ProfilePageProps) => {
const ProfilePage = () => {
  const t = useTranslations('ProfilePage');
  const router = useRouter();
  const { data: session, status } = useSession();
  if (status === 'loading') {
    return <LoadingSpinner2 className="mt-2" />;
  }
  if (status === 'unauthenticated') {
    router
      .replace(
        {
          pathname: '/auth/signin',
          query: {
            callbackUrl: `${router?.locale ? `/${router?.locale}` : ''}${router.asPath}`,
          },
        },
        '/auth/signin'
      )
      .catch((e) => console.error(e));
    return <LoadingSpinner2 className="mt-2" />;
  }
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <main className="container flex flex-col py-6">
        <h1 className="mb-5 truncate text-center text-3xl font-semibold tracking-tight">
          {t('title', { user: session?.user?.name ?? session?.user?.email })}
        </h1>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <LazyProfileQrList />
        </div>
      </main>
    </>
  );
};

export default ProfilePage;

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const messages = await (await import('~/utils/nextIntl')).default(context);
  return { props: { messages: messages } };
};
// export const getServerSideProps = async (context: GetServerSidePropsContext) => {
//   const session = await getServerAuthSession(context);
//   if (!session) {
//     return {
//       redirect: {
//         destination: `/auth/signin?callbackUrl=${getBaseUrl('/profile')}`,
//         permanent: false,
//       },  };
//   }
//   const messages = await (await import('~/utils/nextIntl')).default(context);
//   return { props: { user: session.user, messages: messages } };
// };
