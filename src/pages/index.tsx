import { type GetStaticPropsContext, type NextPage } from 'next';
import { useTranslations } from 'next-intl';
import Head from 'next/head';
import Link from 'next/link';

const HomePage: NextPage = () => {
  const t = useTranslations('HomePage');

  return (
    <>
      <Head>
        <title>4qr</title>
        <meta name="description" content={t('description')} />
      </Head>
      <main className="container flex flex-col items-center justify-center gap-12 bg-background px-4 py-16 ">
        <h1 className="text-5xl font-bold tracking-tight">
          <span className="text-cyan-700 dark:text-[hsl(177,64%,60%)]">4qr</span>
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            href="/create"
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-cyan-500 bg-opacity-90 p-4 text-foreground transition-all hover:bg-cyan-500/80 hover:shadow-inner hover:shadow-cyan-500 dark:text-secondary"
          >
            <h2 className="text-2xl font-bold">{t('Create')}</h2>
            <div className="text-lg">{t('Create and customize qrcode')}</div>
          </Link>
          <Link
            href="/scan"
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-cyan-500 bg-opacity-90 p-4 text-foreground transition-all hover:bg-cyan-500/80 hover:shadow-inner hover:shadow-cyan-500 dark:text-secondary"
          >
            <h2 className="text-2xl font-bold">{t('Scan')}</h2>
            <div className="text-lg">{t('Scan qrcode using webcam or image file')}</div>
          </Link>
        </div>
      </main>
      <footer className="container mt-auto text-center">
        <Link
          href="https://github.com/dfnh/4qr"
          className="transition-all hover:text-foreground/80"
        >
          github
        </Link>
      </footer>
    </>
  );
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const messages = await (await import('~/utils/nextIntl')).default(context);
  return { props: { messages: messages } };
};

export default HomePage;
