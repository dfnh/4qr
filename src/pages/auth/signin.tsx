import { type InferGetServerSidePropsType } from 'next';
import { getProviders, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { LoadingSpinner2 } from '~/components/Spinner';
// import dynamic from 'next/dynamic';

import SignIn from '~/components/SignIn';
// const SignIn = dynamic(() => import('~/components/SignIn'), { ssr: false, loading: () => <LoadingSpinner2 /> });

type SignInPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;
const SignInPage = ({ providers }: SignInPageProps) => {
  const { status } = useSession();
  const router = useRouter();
  if (status === 'authenticated') {
    void router.replace('/');
  }
  if (status === 'loading') {
    return (
      <div className=" mt-2 flex flex-col">
        <LoadingSpinner2 />
      </div>
    );
  }
  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>
      <div className="flex flex-col items-center justify-center gap-6 px-8 py-8">
        <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
        <SignIn providers={providers} />
      </div>
    </>
  );
};

export const getServerSideProps = async () => {
  const providers = await getProviders();
  return { props: { providers: providers ?? [] } };
};

export default SignInPage;
