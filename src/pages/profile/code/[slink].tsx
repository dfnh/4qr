import { type GetServerSidePropsContext, type InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import PieChart, { createDataForPie } from '~/components/PieChart';
import { getBaseUrl } from '~/helpers/getBaseUrl';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';

type ProfileCodeSlinkPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;
const ProfileCodeSlinkPage = ({ user }: ProfileCodeSlinkPageProps) => {
  return (
    <div className="container flex-1 flex-col py-6">
      <ProfileCodeSlinkView />
    </div>
  );
};

export default ProfileCodeSlinkPage;

const ProfileCodeSlinkView = () => {
  const {
    query: { slink },
  } = useRouter();
  const { data: code, isSuccess } = api.user.getQrStats.useQuery(
    {
      slink: slink as string,
    },
    { refetchOnWindowFocus: false }
  );

  const data = useMemo(() => {
    if (!code) return;
    const cityCountMap = code?.CodeStatistic.reduce((map, c) => {
      const city = c.city;
      if (!city) return map;
      const count = map.get(city) ?? 0;
      map.set(city, count + 1);
      return map;
    }, new Map<string, number>());

    if (!cityCountMap) {
      console.error({ cityCountMap });
      return;
    }
    const data = createDataForPie({ map: cityCountMap, dataLabel: '# of visitors' });
    return data;
  }, [code]);

  return (
    <>
      <div className="container flex max-w-md flex-col">
        <p>slink: {code?.shorturl}</p>
        <p>data: {code?.info}</p>
        <p>visited total: {code?.CodeStatistic.length}</p>
        {data && (
          <div className="container">
            <PieChart data={data} />
          </div>
        )}
      </div>
    </>
  );
};

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
