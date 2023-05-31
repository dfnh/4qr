import Link from 'next/link';
import { useRouter } from 'next/router';
import { cn } from '~/utils/cn';
import { type VariantProps, cva } from 'class-variance-authority';
import { useTranslations } from 'next-intl';

export const tabVariants = cva('inline-block rounded-t-lg border-b-2 ', {
  variants: {
    variant: {
      default: 'border-transparent hover:border-gray-300 hover:text-foreground',
      active:
        'active border-cyan-600 text-cyan-600 dark:border-cyan-500 dark:text-cyan-500',
    },
    size: { default: 'p-2' },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});
export type TabVariant = VariantProps<typeof tabVariants>;

const ScanTabs = ({ className }: { className?: string }) => {
  const t = useTranslations('ScanTabs');
  const { asPath } = useRouter();

  return (
    <div className={cn('flex justify-center', className)}>
      <div className="border-b border-gray-200 text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
        <ul className="-mb-px flex flex-wrap gap-2">
          <li className="">
            <Link
              href={'/scan'}
              className={cn(
                tabVariants({ variant: asPath == '/scan' ? 'active' : 'default' })
              )}
            >
              {t('file')}
            </Link>
          </li>
          <li className="">
            <Link
              href={'/scan/cam'}
              className={cn(
                tabVariants({ variant: asPath == '/scan/cam' ? 'active' : 'default' })
              )}
            >
              {t('webcam')}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ScanTabs;
