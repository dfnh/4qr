import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { LoadingSpinner2 } from '~/components/Spinner';
import { useSlinkAtomValue } from '~/store/hooks';
import { api } from '~/utils/api';

const WithPassword = dynamic(() => import('./WithPassword'), { ssr: false });
const WithSignature = dynamic(() => import('./WithSignature'), { ssr: false });
const CountDown = dynamic(() => import('./CountDown'), { ssr: false });

const disableQuery = {
  retry: false,
  staleTime: 86_400_000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
};

type SlinkInnerProps = { slink: string };
const SlinkInner = ({ slink }: SlinkInnerProps) => {
  const t = useTranslations('SSlinkPage.SlinkInner');
  const { query } = useRouter();

  const { data: initData, isLoading } = api.qr.getById.useQuery(
    { slink: slink },
    { ...disableQuery } // { enabled: !!slink, ...disableQuery }
  );
  const { data, error } = api.qr.visitSlink.useQuery(
    { slink: slink, password: query.p as string | undefined },
    { enabled: !initData?.withInput, ...disableQuery }
  );
  const slinkAtom = useSlinkAtomValue();

  if (error) {
    return (
      <p className="mt-2 flex justify-center text-foreground">
        {t('error.title', { error: error.message ?? '' })}
      </p>
    );
  }
  if (isLoading) {
    return <LoadingSpinner2 className="mt-2" />;
  }

  const newInfo = initData?.info ?? data?.info ?? slinkAtom.info;
  const urlInfo = initData?.isUrl || data?.isUrl ? newInfo : undefined;
  const unsuccess = !!data?.success === false && !slinkAtom.success;

  return (
    <>
      <div className="container flex max-w-lg flex-col gap-3 py-4">
        {initData?.image && (
          <div className="flex justify-center">
            <Image
              src={initData.image}
              className="aspect-square w-36 bg-slate-50/80 p-[2px]"
              alt="qrcode"
              width={100}
              height={100}
            />
          </div>
        )}
        <p className="break-all leading-7">
          {t('data')}: {newInfo || '***'}
        </p>

        {unsuccess && initData?.withPassword && <WithPassword slink={slink} />}
        {unsuccess && initData?.withSignature && <WithSignature slink={slink} />}
        {!!urlInfo && <CountDown disabled={data?.signature} url={urlInfo} />}
      </div>
    </>
  );
};

export default SlinkInner;
