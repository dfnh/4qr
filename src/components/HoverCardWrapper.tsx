import { memo, type ReactNode } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '~/ui/hovercard';

export type HoverCardWrapperProps = {
  hoverCardText: string;
  children: ReactNode;
  openDelay?: number;
};

const HoverCardWrapper = memo(
  ({ hoverCardText, children, openDelay = 500 }: HoverCardWrapperProps) => {
    return (
      <HoverCard openDelay={openDelay}>
        <HoverCardTrigger asChild>{children}</HoverCardTrigger>
        <HoverCardContent>{hoverCardText}</HoverCardContent>
      </HoverCard>
    );
  }
);
HoverCardWrapper.displayName = 'HoverCardWrapper';

export default HoverCardWrapper;
