import { LanguagesIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { memo } from 'react';
import { buttonVariants } from '~/ui/button';
import { cn } from '~/utils/cn';

const LanguageSwitch = memo(() => {
  const { locale, locales, asPath } = useRouter();
  const diffLocale = locales?.find((l) => l !== locale);

  return (
    <Link
      href={asPath}
      locale={diffLocale}
      className={cn(
        buttonVariants({
          size: 'sm',
          variant: 'ghost',
        }),
        'px-1'
      )}
    >
      <span className="flex items-center gap-[0.125rem] text-sm">
        <LanguagesIcon size={14} />
        {diffLocale?.toUpperCase()}
      </span>
    </Link>
  );
});
LanguageSwitch.displayName = 'LanguageSwitch';

export default LanguageSwitch;
