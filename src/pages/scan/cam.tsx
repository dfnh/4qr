import Head from 'next/head';
import React from 'react';
import { WebCam } from '~/components/WebCam';

const Cam = () => {
  return (
    <>
      <Head>
        <title>Scan With Webcam</title>
      </Head>
      <main className="flex flex-col items-center justify-center px-8 py-8">
        <WebCam />
      </main>
    </>
  );
};

export default Cam;
