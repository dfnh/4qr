import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { memo, type HTMLAttributes } from 'react';
import { cn } from '~/utils/cn';

const Links = [
  { href: '/create', title: 'Create' },
  { href: '/scan', title: 'Scan' },
] as const;

const MainNavbar = memo(({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const t = useTranslations('UserNav.MainNav');

  return (
    <nav
      className={cn('flex items-center space-x-2 md:space-x-6 lg:space-x-8', className)}
      {...props}
    >
      <Link href={'/'} className="pl-4 text-2xl font-normal leading-tight">
        4qr
      </Link>
      {Links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="text-sm font-medium tracking-tight text-muted-foreground transition-colors hover:text-primary"
        >
          {t(l.title)}
        </Link>
      ))}
    </nav>
  );
});
MainNavbar.displayName = 'MainNavbar';

export default MainNavbar;
