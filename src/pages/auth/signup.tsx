import { type GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import SignUp from '~/components/SignUp';
import { getServerAuthSession } from '~/server/auth';

const SignUpPage = () => {
  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
      <div className="flex flex-col items-center justify-center gap-6 px-8 py-8">
        <h1 className="text-3xl font-semibold tracking-tight">Sign up</h1>
        <SignUp />
      </div>
    </>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(context);
  if (session) {
    return { redirect: { destination: '/', permanent: false } };
  }
  return { props: { session: session } };
};

export default SignUpPage;
