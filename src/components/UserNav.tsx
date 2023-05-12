import { signIn, useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useCallback } from 'react';
import { Button } from '~/ui/button';
import { MainNavbar } from './MainNavbar';
import { LoadingSpinner } from './Spinner';

// import UserDropdown from './UserDropdown';
const UserDropdown = dynamic(() => import('./UserDropdown'), { ssr: false });

const Auth = () => {
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
};
// todo move
const LoginButton = () => {
  const onClick = useCallback(() => void signIn(), []);

  return (
    <Button variant="outline" className="text-white/90" onClick={onClick}>
      Sign in
    </Button>
  );
};

// todo move
//? nav
const UserNav = () => {
  return (
    <nav className="flex h-12 items-center border-b border-slate-300 px-4 dark:border-slate-700">
      <MainNavbar className="leading-tight" />
      <span className="ml-auto flex items-center space-x-4">
        <Auth />
      </span>
    </nav>
  );
};

export { UserNav, Auth };
