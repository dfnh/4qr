import { type ChangeEvent, useState, useCallback } from 'react';
import { type NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import QrScanner from 'qr-scanner';

import { InputFile } from '~/components/InputFile';

//todo decompose
const ScanPage: NextPage = () => {
  const [im, setIm] = useState<string | null>(null);
  const [data, setData] = useState<string | null>(null);

  const handleImageChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const f = event.target.files?.[0];
    if (!f) return; // todo throw error or smth mb

    QrScanner.scanImage(f, { returnDetailedScanResult: true })
      .then((result) => setData(result.data))
      .catch((error) => setData(error as string));

    setIm(URL.createObjectURL(f));
  }, []);

  return (
    <>
      <Head>
        <title>Scanning QR code</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#0fc1e4] to-[#26006e]">
        <div className="container flex flex-col items-center justify-center gap-12 px-8 py-16">
          <h1 className="text-5xl font-bold tracking-tight text-white ">scan qr code</h1>
          <div className="container flex flex-col items-center gap-6">
            <div className="container max-w-md">
              <InputFile
                labelTitle="Select qr code"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            {data && <p className="break-all text-gray-900">{data}</p>}
            {im && <Image src={im} alt="Users qr code" width={128} height={128} />}
          </div>
        </div>
      </main>
    </>
  );
};

export default ScanPage;
