import { Copy } from 'lucide-react';
import { memo } from 'react';
import { type ButtonProps } from '~/ui/button';
import { cn } from '~/utils/cn';

type CopyButtonProps = { iconClassName?: string } & ButtonProps;

const CopyButton = memo(function CopyButton({
  onClick,
  className,
  iconClassName,
  ...rest
}: CopyButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'hover:animate-hue-rotation hover:text-emerald-500 dark:hover:text-emerald-200',
        className
      )}
      {...rest}
    >
      <Copy className={cn('h-4 w-4', iconClassName)} />
    </button>
  );
});

export { CopyButton };
