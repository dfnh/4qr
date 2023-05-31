import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { memo } from 'react';
import { LoadingSpinner } from '~/components/Spinner';

const LoginButton = dynamic(() => import('./LoginButton'));
const UserDropdown = dynamic(() => import('./UserDropdown'), { ssr: false });

const Auth = memo(() => {
  const { data, status } = useSession();

  if (status === 'unauthenticated') {
    return <LoginButton />;
  }
  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <UserDropdown
      email={data?.user.email ?? 'email@example.com'}
      image={data?.user.image ?? undefined}
      name={data?.user.name ?? 'user'}
    />
  );
});
Auth.displayName = 'Auth';

export default Auth;
