import { MoonIcon, SunIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Button } from '~/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '~/ui/dropdown';

const ThemeDropdownContent = dynamic(() => import('./ThemeDropdownContent'), {
  ssr: false,
});
/** @deprecated ThemeButton */
const ThemeDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="w-9 px-0">
          <SunIcon className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <ThemeDropdownContent />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeDropdown;
