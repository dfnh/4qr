import dynamic from 'next/dynamic';
import Head from 'next/head';
import { LoadingSpinner2 } from '~/components/Spinner';

const LazyWebCam = dynamic(() => import('~/components/WebCam'), {
  ssr: false,
  loading: () => <LoadingSpinner2 />,
});

const Cam = () => {
  return (
    <>
      <Head>
        <title>Scan With Webcam</title>
      </Head>
      <main className="flex flex-col items-center justify-center px-8 py-8">
        <LazyWebCam />
      </main>
    </>
  );
};

export default Cam;
