import { type GetServerSidePropsContext, type InferGetServerSidePropsType } from 'next';
import { getProviders } from 'next-auth/react';
import Head from 'next/head';
import SignIn from '~/components/SignIn';
import { getServerAuthSession } from '~/server/auth';

type SignInPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;
const SignInPage = ({ providers }: SignInPageProps) => {
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

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(context);
  if (session) {
    return { redirect: { destination: '/', permanent: false } };
  }

  const providers = await getProviders();
  return {
    props: { providers: providers ?? [] },
  };
};

export default SignInPage;
