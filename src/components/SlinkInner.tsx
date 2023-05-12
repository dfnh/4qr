import Image from 'next/image';
import { useRouter } from 'next/router';
import { CountDown } from '~/components/CountDown';
import {
  FormPartOfSlinkPassword,
  FormPartOfSlinkSignature,
} from '~/components/FormPartOfSlink';
import { LoadingSpinner2 } from '~/components/Spinner';
import { useSlinkAtomValue } from '~/store/hooks';
import { api } from '~/utils/api';

const SlinkInner = () => {
  const {
    query: { slink, p }, //? password as query
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

  const slinkAtom = useSlinkAtomValue();

  if (error) {
    return (
      <p className="mt-2 flex justify-center text-foreground">
        nothing here. error: {error.message}
      </p>
    );
  }

  if (isLoading) {
    return (
      <div className=" mt-2 flex flex-col">
        <LoadingSpinner2 />
      </div>
    );
  }

  const newInfo = data?.info ?? slinkAtom.info;
  const urlInfo = data?.isUrl ? newInfo : undefined;
  const unsuccess = data?.success === false && !slinkAtom.success;

  return (
    <>
      <div className="container flex max-w-lg flex-col gap-3 py-4">
        {data?.qrUrl && (
          <div className="flex justify-center">
            <Image
              src={data.qrUrl}
              className="aspect-square w-36 bg-slate-50 p-[2px]"
              alt="qrcode"
              width={144}
              height={144}
            />
          </div>
        )}
        <p className="break-all leading-7">data: {newInfo || '***'}</p>

        {unsuccess && data.password && (
          <FormPartOfSlinkPassword slink={slink as string} />
        )}
        {unsuccess && data?.signature && (
          <FormPartOfSlinkSignature slink={slink as string} />
        )}
        {!!urlInfo && <CountDown disabled={data?.signature} url={urlInfo} />}
      </div>
    </>
  );
};

export { SlinkInner };
