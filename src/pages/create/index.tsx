import { type GetStaticPropsContext, type NextPage } from 'next';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { LoadingSpinner2 } from '~/components/Spinner';

const LazyCreateQrInner = dynamic(() => import('~/components/CreateQrInner'), {
  ssr: false,
  loading: () => <LoadingSpinner2 />,
});

const CreateQrPage: NextPage = () => {
  const t = useTranslations('CreateQrPage');

  return (
    <>
      <Head>
        <title>{t('head.title')}</title>
      </Head>
      <div className="container flex flex-col items-center justify-center gap-10 px-2 py-14 md:px-8">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{t('title')}</h1>
        <div className="container flex flex-col justify-evenly gap-1 md:flex-row md:gap-0">
          <LazyCreateQrInner />
        </div>
      </div>
    </>
  );
};

export default CreateQrPage;

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const messages = await (await import('~/utils/nextIntl')).default(context);
  return { props: { messages: messages } };
};
