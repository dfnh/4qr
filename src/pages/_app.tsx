import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'jotai';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppType } from 'next/app';
import { Inter } from 'next/font/google';
import { Toaster } from '~/components/Toaster';
import { api } from '~/utils/api';

import Layout from '~/components/Layout';
import '~/styles/globals.css';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-sans: ${fontSans.style.fontFamily};
          }
        `}
      </style>
      <Provider>
        <SessionProvider refetchOnWindowFocus={false} session={session}>
          <ReactQueryDevtools />
          <Layout>
            <Component {...pageProps} />
            <Toaster />
          </Layout>
        </SessionProvider>
      </Provider>
    </>
  );
};

export default api.withTRPC(MyApp);
