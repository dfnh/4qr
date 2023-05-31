import { Laptop2Icon, MoonIcon, SunIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { DropdownMenuItem } from '~/ui/dropdown';

/** @deprecated ThemeButton */
const ThemeDropdownContent = () => {
  const { setTheme } = useTheme();
  const t = useTranslations('UserNav.ThemeDropdown');

  const toggleLight = () => setTheme('light');
  const toggleDark = () => setTheme('dark');
  const toggleSystem = () => setTheme('system');

  return (
    <>
      <DropdownMenuItem onClick={toggleLight}>
        <SunIcon className="mr-2 h-4 w-4" />
        <span>{t('Light')}</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={toggleDark}>
        <MoonIcon className="mr-2 h-4 w-4" />
        <span>{t('Dark')}</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={toggleSystem}>
        <Laptop2Icon className="mr-2 h-4 w-4" />
        <span>{t('System')}</span>
      </DropdownMenuItem>
    </>
  );
};

export default ThemeDropdownContent;
