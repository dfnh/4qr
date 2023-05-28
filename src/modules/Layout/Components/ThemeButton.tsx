import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '~/ui/button';

const ThemeButton = () => {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'light') {
      return setTheme('dark');
    }
    setTheme('light');
  };

  return (
    <Button variant="ghost" size="sm" className="w-9 px-0" onClick={toggleTheme}>
      <SunIcon className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Change theme</span>
    </Button>
  );
};

export default ThemeButton;
