import { type InferGetServerSidePropsType, type GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { getBaseUrl } from '~/helpers/getBaseUrl';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';

const ProfileCodeSlink = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {
    query: { slink },
  } = useRouter();
  const { data: code, isSuccess } = api.user.getQrStats.useQuery({
    slink: slink as string,
  });

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <div className="container flex flex-col py-6">{code?.info}</div>
    </div>
  );
};

export default ProfileCodeSlink;

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
