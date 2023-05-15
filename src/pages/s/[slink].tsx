import Head from 'next/head';
import { SlinkInner } from '~/components/SlinkInner';

const SSlinkPage = () => {
  return (
    <>
      <Head>
        <title>Slink</title>
      </Head>
      <div className="flex flex-col items-center justify-center">
        <SlinkInner />
      </div>
    </>
  );
};

export default SSlinkPage;
