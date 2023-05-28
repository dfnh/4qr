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
import { useTranslations } from 'next-intl';
const PieChart = dynamic(() => import('~/components/PieChart'), { ssr: false });

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
  const t = useTranslations('ProfileCodePage');
  const {
    replace,
    locale,
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
      void replace(`${locale ? `/${locale}` : ''}/profile`);
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
        <title>{t('head.title', { code: code?.shorturl ?? '' })}</title>
      </Head>
      <div className="container flex max-w-md flex-col gap-2">
        <p>
          {t('slink')}: {code?.shorturl}
        </p>
        <p>
          {t('data')}: {code?.info}
        </p>
        <Button variant="destructive" size="sm" onClick={onDelete} disabled={isLoading}>
          {t('delete this code')}
        </Button>
        <Separator className="my-2" />
        <p>
          {t('visited total')}: {code?.CodeStatistic.length}
        </p>
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
  const locale = context.locale ? `/${context.locale}` : '';
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
  return { props: { user: session.user, messages: messages } };
};
