// import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
// import { getIp } from '~/helpers/getIp';
import { useRouter } from 'next/router';
import { api } from '~/utils/api';

const Slink = () => {
  const {
    query: { slink },
  } = useRouter();
  // const slink = query?.slink as string;

  const { data } = api.qr.visitSlink.useQuery(
    { slink: slink as string },
    {
      enabled: !!slink,
      retry: false,
      staleTime: 86_400_000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );

  return (
    <div>
      <p>{data?.id || 'id'}</p>
      {/* eslint-disable-next-line @next/next/no-img-element*/}
      <img src={data?.qrUrl ?? ''} alt="qr" />
    </div>
  );
};

export default Slink;
