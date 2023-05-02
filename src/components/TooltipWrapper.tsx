import { type ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/ui/tooltip';

type TooltipProps = { TooltipText: string; children: ReactNode };

const TooltipWrapper = ({ TooltipText, children }: TooltipProps) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent align="start" side="bottom">
          <p className="max-w-md break-all text-xs">{TooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { TooltipWrapper };
