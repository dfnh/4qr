import Head from 'next/head';
import { type ReactNode } from 'react';
import { UserNav } from '~/components/UserNav';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="utf-8" />
      </Head>
      <div className="dark flex min-h-screen w-full grow flex-col bg-background text-foreground">
        <UserNav />
        <div>{children}</div>
      </div>
    </>
  );
};

export default Layout;
