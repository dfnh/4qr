import { type GetServerSidePropsContext, type InferGetServerSidePropsType } from 'next'; // type GetServerSideProps,
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { getBaseUrl } from '~/helpers/getBaseUrl';
import { getServerAuthSession } from '~/server/auth';

const LazyProfileQrList = dynamic(() => import('~/components/ProfileQrList'), {
  ssr: false,
});

type ProfilePageProps = InferGetServerSidePropsType<typeof getServerSideProps>;
const ProfilePage = ({ user }: ProfilePageProps) => {
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <main className="container flex flex-col py-6">
        <h1 className="mb-5 truncate text-ellipsis text-center text-3xl font-semibold tracking-tight transition-colors">
          {user.name ?? user.email}`s qr codes
        </h1>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <LazyProfileQrList />
        </div>
      </main>
    </>
  );
};

export default ProfilePage;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(context);
  if (!session) {
    return {
      redirect: {
        destination: `/auth/signin?callbackUrl=${getBaseUrl('/profile')}`,
        permanent: false,
      },
    };
  }
  return { props: { user: session.user } };
};
