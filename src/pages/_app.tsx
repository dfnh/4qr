import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { api } from '~/utils/api';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import '~/styles/globals.css';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ReactQueryDevtools />

      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
