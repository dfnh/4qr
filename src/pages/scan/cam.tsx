import { type GetStaticPropsContext } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { LoadingSpinner2 } from '~/components/Spinner';

const WebCam = dynamic(() => import('~/components/WebCam'), {
  ssr: false,
  loading: () => <LoadingSpinner2 />,
});

const CamPage = () => {
  return (
    <>
      <Head>
        <title>Scan With Webcam</title>
      </Head>
      <main className="flex flex-col items-center justify-center px-8 py-8">
        <WebCam />
      </main>
    </>
  );
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const messages = await (await import('~/utils/nextIntl')).default(context);
  return { props: { messages: messages } };
};

export default CamPage;
