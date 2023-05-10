import { type NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { LoadingSpinner2 } from '~/components/Spinner';

const LazyCreateQrInner = dynamic(() => import('~/components/CreateQrInner'), {
  ssr: false,
  loading: () => <LoadingSpinner2 />,
});

const CreateQr: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create code</title>
      </Head>
      <div className="container flex flex-col items-center justify-center gap-10 px-2 py-14 md:px-8">
        <h1 className="text-5xl font-bold tracking-tight">create qr code</h1>
        <div className="container flex flex-col justify-evenly gap-2 md:flex-row md:gap-0">
          <LazyCreateQrInner />
        </div>
      </div>
    </>
  );
};

export default CreateQr;
