import { type NextPage } from 'next';
import Head from 'next/head';
import { CardCreate } from '~/components/CardCreate';
import { DisplayQr } from '~/components/DisplayQr';

// todo DisplayQr - position sticky
const CreateQr: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create code</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-bold tracking-tight text-white ">
            create QR code
          </h1>
          <div className="container flex w-11/12 flex-col justify-evenly gap-2 md:flex-row">
            <div className="md:order-2 md:w-2/6">
              <DisplayQr />
            </div>
            <div className="md:w-3/6 ">
              <CardCreate />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default CreateQr;
