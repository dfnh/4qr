import { type NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { LoadingSpinner2 } from '~/components/Spinner';

const LazyScanWithFile = dynamic(() => import('~/components/ScanWithFile'), {
  ssr: false,
  loading: () => <LoadingSpinner2 />,
});

const ScanPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Scanning QR code</title>
      </Head>
      <main className="flex flex-col items-center justify-center gap-12 px-8 py-16">
        <h1 className="text-5xl font-bold tracking-tight ">scan qr code</h1>
        <div className="container flex flex-col items-center gap-6">
          <LazyScanWithFile />
        </div>
      </main>
    </>
  );
};

export default ScanPage;
