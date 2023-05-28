import { ThemeProvider as NTProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return <NTProvider {...props}>{children}</NTProvider>;
};

export default ThemeProvider;
