import { type GetStaticPropsContext, type NextPage } from 'next';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { LoadingSpinner2 } from '~/components/Spinner';

const LazyScanWithFile = dynamic(() => import('~/components/ScanWithFile'), {
  ssr: false,
  loading: () => <LoadingSpinner2 />,
});

const ScanPage: NextPage = () => {
  const t = useTranslations('ScanPage');

  return (
    <>
      <Head>
        <title>Scan QR code</title>
      </Head>
      <main className="flex flex-col items-center justify-center gap-12 px-8 py-16">
        <h1 className="text-center text-4xl font-bold tracking-tight md:text-5xl ">
          {t('title')}
        </h1>
        <div className="container flex flex-col items-center gap-6">
          <LazyScanWithFile />
        </div>
      </main>
    </>
  );
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const messages = await (await import('~/utils/nextIntl')).default(context);
  return { props: { messages: messages } };
};

export default ScanPage;
