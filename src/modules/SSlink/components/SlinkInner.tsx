import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { LoadingSpinner2 } from '~/components/Spinner';
import { useSlinkAtomValue } from '~/store/hooks';
import { api } from '~/utils/api';
import { type CommonProps } from '../types';

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

const SlinkInner = ({ slink, geo }: CommonProps) => {
  const t = useTranslations('SSlinkPage.SlinkInner');
  const { query } = useRouter();

  const { data, error, isLoading } = api.qr.visitSlink.useQuery(
    { slink: slink, geo: geo, password: query.p as string | undefined },
    { enabled: !!slink, ...disableQuery }
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

  const newInfo = data?.info ?? slinkAtom.info;
  const urlInfo = data?.isUrl ? newInfo : undefined;
  const unsuccess = !!data?.success === false && !slinkAtom.success;

  return (
    <>
      <div className="container flex max-w-lg flex-col gap-3 py-4">
        {data.image && (
          <div className="flex justify-center">
            <Image
              src={data.image}
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

        {unsuccess && data?.withPassword && <WithPassword slink={slink} geo={geo} />}
        {unsuccess && data?.withSignature && <WithSignature slink={slink} geo={geo} />}
        {!!urlInfo && <CountDown disabled={data?.withSignature} url={urlInfo} />}
      </div>
    </>
  );
};

export default SlinkInner;
