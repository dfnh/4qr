import { type GetStaticPropsContext } from 'next';
import { useTranslations } from 'next-intl';
import Head from 'next/head';
import Link from 'next/link';

const NotFoundPage = () => {
  const t = useTranslations('404');

  return (
    <>
      <Head>
        <title>{t('head.title')}</title>
      </Head>
      <main className="container flex flex-col gap-6 py-6">
        <h1 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
          {t('title')}
        </h1>
        <div className="container flex flex-col items-center gap-6">
          <p className="text-center leading-7 [&:not(:first-child)]:mt-6">{t('text')}</p>
          <Link href="/">{t('link')}</Link>
        </div>
      </main>
    </>
  );
};

export default NotFoundPage;

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const messages = await (await import('~/utils/nextIntl')).default(context);
  return { props: { messages: messages } };
};
