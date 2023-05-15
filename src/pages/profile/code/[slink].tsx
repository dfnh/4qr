import { type GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { getBaseUrl } from '~/helpers/getBaseUrl';
import { getServerAuthSession } from '~/server/auth';
import { Button } from '~/ui/button';
import { Separator } from '~/ui/separator';
import { api } from '~/utils/api';

// import PieChart, { createDataForPie } from '~/components/PieChart';
import { createDataForPie } from '~/helpers/createDataForPie';
const PieChart = dynamic(() => import('~/components/PieChart'), {
  ssr: false,
});

// type ProfileCodeSlinkPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;
const ProfileCodeSlinkPage = () => {
  return (
    <>
      <div className="container flex-1 flex-col py-6">
        <ProfileCodeSlinkView />
      </div>
    </>
  );
};

export default ProfileCodeSlinkPage;

const ProfileCodeSlinkView = () => {
  const {
    replace,
    query: { slink },
  } = useRouter();
  const { data: code } = api.user.getQrStats.useQuery(
    {
      slink: slink as string,
    },
    { refetchOnWindowFocus: false }
  );

  const { mutate, isLoading } = api.user.deleteQr.useMutation({
    onError(error) {
      console.error(error);
    },
    onSuccess() {
      void replace('/profile');
    },
  });

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

  const onDelete = () => {
    if (code?.id) {
      mutate({ id: code?.id });
    }
  };

  return (
    <>
      <Head>
        <title>Code statistics - {code?.shorturl}</title>
      </Head>
      <div className="container flex max-w-md flex-col gap-2">
        <p>slink: {code?.shorturl}</p>
        <p>data: {code?.info}</p>
        <Button variant="destructive" size="sm" onClick={onDelete} disabled={isLoading}>
          delete this code
        </Button>
        <Separator className="my-2" />
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
