import Link from 'next/link';

import { cn } from '~/utils/cn';

const Links = [
  { href: '/create', title: 'Create' },
  { href: '/scan', title: 'Scan/file' },
  { href: '/scan/cam', title: 'Scan/camera' },
];

const MainNavbar = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
  return (
    <nav
      className={cn('flex items-center space-x-3 md:space-x-6 lg:space-x-8', className)}
      {...props}
    >
      <Link href={'/'} className="pl-4 text-2xl font-normal leading-tight">
        4qr
      </Link>
      {Links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          {l.title}
        </Link>
      ))}
    </nav>
  );
};
export { MainNavbar };
