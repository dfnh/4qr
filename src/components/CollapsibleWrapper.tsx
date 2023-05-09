import { type ReactNode, useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '~/ui/button';
import { cn } from '~/utils/cn';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/ui/collapsible';

type CollapsibleWrapperProps = {
  title: string;
  children: ReactNode;
  className?: string;
  defaultIsOpen?: boolean;
};

export function CollapsibleWrapper({
  title,
  children,
  className,
  defaultIsOpen = false,
}: CollapsibleWrapperProps) {
  const [isOpen, setIsOpen] = useState(defaultIsOpen);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={'w-full space-y-2 rounded-md border text-foreground'}
    >
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">{title}</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <Plus className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-45')} />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent
        className={cn(
          'space-y-2 overflow-hidden',
          isOpen ? 'animate-collapse-down' : 'animate-collapse-up'
        )}
      >
        <div className={cn('px-4 py-2 text-sm', className)}>{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}
