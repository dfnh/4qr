import { type GetServerSidePropsContext, type InferGetServerSidePropsType } from 'next';
import { getBaseUrl } from '~/helpers/getBaseUrl';
import { getServerAuthSession } from '~/server/auth';

import ProfileCode from '~/modules/ProfileCode';

type ProfileCodeSlinkPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;
const ProfileCodeSlinkPage = ({ slink }: ProfileCodeSlinkPageProps) => {
  return (
    <>
      <div className="container flex-1 flex-col py-6">
        <ProfileCode slink={slink} />
      </div>
    </>
  );
};

export default ProfileCodeSlinkPage;

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ slink: string }>
) => {
  const session = await getServerAuthSession(context);
  const locale = context.locale ? `/${context.locale}` : '';
  const slink = context.params?.slink;

  if (slink == null) {
    return { redirect: { destination: `${locale}/`, permanent: false } };
  }
  if (!session) {
    return {
      redirect: {
        destination: `${locale}/auth/signin?callbackUrl=${getBaseUrl(
          `${locale}/profile`
        )}`,
        permanent: false,
      },
    };
  }
  const messages = await (await import('~/utils/nextIntl')).default(context);
  return { props: { messages: messages, slink: slink } };
};
