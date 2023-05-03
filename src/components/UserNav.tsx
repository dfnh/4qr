import { useCallback } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { UserDropdown } from './UserDropdown';
import { Button } from '~/ui/button';
import { LoadingSpinner } from './Spinner';

const UserNav = () => {
  const { data, status } = useSession();

  const logout = useCallback(() => void signOut(), []);

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
      logout={logout}
    />
  );
};
// todo move
const LoginButton = () => {
  const onClick = useCallback(() => void signIn(), []);

  return (
    <>
      <Button variant="outline" className="text-white/90" onClick={onClick}>
        Sign in
      </Button>
    </>
  );
};

// todo move
//? nav
const Auth = () => {
  return (
    <>
      <div className="flex flex-col">
        <div className="border-b border-gray-700">
          <div className="flex h-16 items-center px-4">
            {/* <MainNav className="" /> */}
            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { Auth, UserNav };
