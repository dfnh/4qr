import { type NextPage } from 'next';
import Head from 'next/head';

// import { api } from '~/utils/api';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>yo</title>
        <meta name="description" content="Home" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-tr from-[#5816d4] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-[hsl(177,56%,60%)]">yo</span>
          </h1>
        </div>
      </main>
    </>
  );
};

export default Home;
