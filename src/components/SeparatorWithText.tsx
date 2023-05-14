import { type HTMLAttributes, memo } from 'react';
import { cn } from '~/utils/cn';

export type SeparatorWithTextProps = { text?: string } & HTMLAttributes<HTMLDivElement>;

const SeparatorWithText = memo(({ text, className }: SeparatorWithTextProps) => {
  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">{text}</span>
      </div>
    </div>
  );
});
SeparatorWithText.displayName = 'SeparatorWithText';

export default SeparatorWithText;
