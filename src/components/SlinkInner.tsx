/* eslint-disable @next/next/no-img-element */ //!
import { useRouter } from 'next/router';
import { LoadingSpinner } from '~/components/Spinner';
import { CountDown } from '~/components/CountDown';
import { api } from '~/utils/api';
import { useSlinkAtomValue } from '~/store/hooks';
import {
  FormPartOfSlinkPassword,
  FormPartOfSlinkSignature,
} from '~/components/FormPartOfSlink';

const SlinkInner = () => {
  const {
    query: { slink, p, hp }, //? password as query
  } = useRouter();

  const { data, isLoading, error } = api.qr.visitSlink.useQuery(
    { slink: slink as string, password: p as string | undefined },
    {
      enabled: !!slink,
      retry: false,
      staleTime: 86_400_000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );

  console.log(data);

  const slinkAtom = useSlinkAtomValue();

  if (error) {
    return (
      <p className="flex justify-center text-white">
        nothing here. error: {error.message}
      </p>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const newInfo = data?.info ?? slinkAtom.info;
  const urlInfo = data?.isUrl ? newInfo : undefined;

  return (
    <>
      <div className="container flex max-w-lg flex-col gap-3 py-4">
        {data?.qrUrl && (
          <div className="flex justify-center">
            <img
              src={data.qrUrl}
              className="aspect-square w-36 bg-slate-50 p-1"
              alt="qr"
            />
          </div>
        )}
        <p className="break-all leading-7">data: {newInfo || '***'}</p>

        {data?.success === false && !slinkAtom.success && data.password && (
          <FormPartOfSlinkPassword slink={slink as string} />
        )}
        {data?.success === false && !slinkAtom.success && data?.signature && (
          <FormPartOfSlinkSignature slink={slink as string} />
        )}
        {!!urlInfo && <CountDown disabled={data?.signature} url={urlInfo} />}
      </div>
    </>
  );
};

export { SlinkInner };
