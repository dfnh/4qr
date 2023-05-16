import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import SignUp from '~/components/SignUp';
import { LoadingSpinner2 } from '~/components/Spinner';

const SignUpPage = () => {
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
        <title>Sign up</title>
      </Head>
      <div className="flex flex-col items-center justify-center gap-6 px-8 py-8">
        <h1 className="text-3xl font-semibold tracking-tight">Sign up</h1>
        <SignUp />
      </div>
    </>
  );
};

export default SignUpPage;
