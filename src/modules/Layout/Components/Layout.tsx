import Head from 'next/head';
import { type ReactNode } from 'react';
import UserNav from './UserNav';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen w-full grow flex-col bg-background text-foreground">
        <UserNav />
        <div>{children}</div>
      </div>
    </>
  );
};

export default Layout;
