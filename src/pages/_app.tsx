import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'jotai';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { NextIntlProvider } from 'next-intl';
import { type AppType } from 'next/app';
import { Inter } from 'next/font/google';
import ThemeProvider from '~/components/ThemeProvider';
import { Toaster } from '~/components/Toaster';
import { Layout } from '~/modules/LayoutNav';
import { api } from '~/utils/api';

import '~/styles/globals.css';

const fontSans = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
});

const App: AppType<{ session: Session | null; messages?: IntlMessages }> = ({
  Component,
  pageProps: { session, messages, ...pageProps },
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
      <SessionProvider refetchOnWindowFocus={false} session={session}>
        <Provider>
          <NextIntlProvider messages={messages} onError={(e) => console.error(e)}>
            <ReactQueryDevtools />
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ThemeProvider>
            <Toaster />
          </NextIntlProvider>
        </Provider>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(App);
