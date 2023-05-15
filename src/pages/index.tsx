import { type NextPage } from 'next';
import Head from 'next/head';

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>4qr</title>
        <meta name="description" content="4qr" />
      </Head>
      <main className="container flex flex-col items-center justify-center gap-12 bg-background px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          <span className="text-[hsl(177,56%,60%)]">yo</span>
        </h1>
      </main>
    </>
  );
};

export default HomePage;
