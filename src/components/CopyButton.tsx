import { Copy } from 'lucide-react';
import { memo } from 'react';
import { type ButtonProps } from '~/ui/button';
import { cn } from '~/utils/cn';

const CopyButton = memo(function CopyButton({ onClick, className }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'hover:animate-hue-rotation hover:text-emerald-500 dark:hover:text-emerald-200',
        className
      )}
    >
      <Copy className="h-4 w-4" />
    </button>
  );
});

export { CopyButton };
