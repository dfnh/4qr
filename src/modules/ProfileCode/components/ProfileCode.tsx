import { useFormatter, useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { Button } from '~/ui/button';
import { Separator } from '~/ui/separator';
import { api } from '~/utils/api';
import { codeStatisticReduce } from '../helpers/codeStatisticReducer';
import { createDataForPie } from '../helpers/createDataForPie';

const PieChart = dynamic(() => import('./PieChart'), { ssr: false });

const ProfileCode = ({ slink }: { slink: string }) => {
  const format = useFormatter();
  const t = useTranslations('ProfileCodePage');
  const { replace, locale } = useRouter();

  const { data: code, error } = api.user.getQrStats.useQuery(
    { slink: slink },
    { refetchOnWindowFocus: false, retry: 0 }
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
    const cityCountMap = code?.CodeStatistic.reduce(
      codeStatisticReduce,
      new Map<string, number>()
    );

    if (!cityCountMap) {
      console.error('cityCountMap error');
      return;
    }
    const data = createDataForPie({ map: cityCountMap, dataLabel: t('#visited') });
    return data;
  }, [code, t]);

  const onDelete = () => {
    if (code?.id) {
      mutate({ id: code?.id });
    }
  };

  if (error) {
    return <p className="mt-2 flex justify-center text-foreground">{t('error')}</p>;
  }
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
        {code?.createdAt && (
          <p>
            {t('createdAt')}: {format.dateTime(code.createdAt)}
          </p>
        )}
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

export default ProfileCode;
