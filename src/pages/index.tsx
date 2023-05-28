import { type GetStaticPropsContext, type NextPage } from 'next';
import { useTranslations } from 'next-intl';
import Head from 'next/head';

const HomePage: NextPage = () => {
  const t = useTranslations('HomePage');

  return (
    <>
      <Head>
        <title>4qr</title>
        <meta name="description" content="4qr" />
      </Head>
      <main className="container flex flex-col items-center justify-center gap-12 bg-background px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="text-[hsl(177,56%,60%)]">{t('yo')}</span>
        </h1>
      </main>
    </>
  );
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const messages = await (await import('~/utils/nextIntl')).default(context);
  return { props: { messages: messages } };
};

export default HomePage;
