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
      </Head>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-bold tracking-tight">create qr code</h1>
        <div className="container flex w-11/12 flex-col justify-evenly gap-2 md:flex-row">
          <div className="md:order-2 md:w-2/6">
            <DisplayQr />
          </div>
          <div className="md:w-3/6 ">
            <CardCreate />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateQr;
