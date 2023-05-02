import { type InferGetServerSidePropsType, type GetServerSidePropsContext } from 'next'; // type GetServerSideProps,
import { ProfileQrList } from '~/components/ProfileQrList';
import { getBaseUrl } from '~/helpers/getBaseUrl';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';

const Profile = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <div className="container flex flex-col py-6">
        <h1 className="mb-5 truncate text-ellipsis text-center text-3xl font-semibold tracking-tight transition-colors">
          {user.name ?? user.email}`s qr codes
        </h1>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ProfileQrList />
        </div>
      </div>
    </div>
  );
};

export default Profile;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      redirect: {
        destination: `/api/auth/signin?callbackUrl=${getBaseUrl('/profile')}`,
        permanent: false,
      },
    };
  }

  return {
    props: { user: session.user },
  };
};
