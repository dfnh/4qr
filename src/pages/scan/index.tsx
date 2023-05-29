import { type GetStaticPropsContext, type NextPage } from 'next';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import ScanTabs from '~/components/ScanTabs';
import { LoadingSpinner2 } from '~/components/Spinner';

const ScanFile = dynamic(() => import('~/modules/ScanFile'), {
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
      <main className="flex flex-col items-center justify-center px-8 py-2">
        <ScanTabs className="mb-4" />
        <div className="container flex flex-col items-center justify-center gap-10 pb-4 ">
          <h1 className="text-center text-2xl font-semibold tracking-tight md:text-4xl ">
            {t('title')}
          </h1>

          <ScanFile />
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
