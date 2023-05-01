import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { api } from '~/utils/api';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'jotai';
import { Toaster } from '~/components/Toaster';

import '~/styles/globals.css';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <Provider>
      <SessionProvider refetchOnWindowFocus={false} session={session}>
        <ReactQueryDevtools />

        <Component {...pageProps} />
        <Toaster />
      </SessionProvider>
    </Provider>
  );
};

export default api.withTRPC(MyApp);
