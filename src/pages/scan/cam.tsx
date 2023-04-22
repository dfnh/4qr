import Head from 'next/head';
import React from 'react';
import { WebCam } from '~/components/WebCam';

const cam = () => {
  return (
    <>
      <Head>
        <title>Scan With Webcam</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#0fc1e4] to-[#26006e] px-8 py-8">
        <WebCam />
      </main>
    </>
  );
};

export default cam;
