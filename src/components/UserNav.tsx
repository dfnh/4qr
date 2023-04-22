import { useCallback } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { UserDropdown } from './UserDropdown';
import { Button } from '~/ui/button';

const UserNav = () => {
  const { data, status } = useSession();

  const logout = useCallback(() => void signOut(), []);

  return (
    <>
      {status === 'authenticated' ? (
        <>
          <UserDropdown
            email={data.user.email}
            image={data.user.image}
            name={data.user.name}
            logout={logout}
          />
        </>
      ) : (
        <>
          <LoginButton />
        </>
      )}
    </>
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
