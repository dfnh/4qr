import dynamic from 'next/dynamic';
import { memo } from 'react';
import Auth from './Auth';
import LanguageSwitch from './LanguageSwitch';
import MainNavbar from './MainNavbar';
// import ThemeButton from './ThemeButton';

const ThemeButton = dynamic(() => import('./ThemeButton'), { ssr: false });

const UserNav = memo(() => {
  return (
    <nav className="flex h-12 items-center border-b border-slate-300 px-4 dark:border-slate-700">
      <MainNavbar className="leading-tight" />
      <span className="ml-auto flex items-center space-x-1 md:space-x-2">
        <LanguageSwitch />
        {/* <ThemeDropdown /> */}
        <ThemeButton />
        <Auth />
      </span>
    </nav>
  );
});
UserNav.displayName = 'UserNav';

export default UserNav;
