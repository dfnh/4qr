import { type HoverCardContentProps } from '@radix-ui/react-hover-card';
import { memo } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '~/ui/hovercard';

export type HoverCardWrapperProps = {
  hoverCardText?: string;
  openDelay?: number;
  closeDelay?: number;
} & HoverCardContentProps;

const HoverCardWrapper = memo(
  ({
    hoverCardText,
    children,
    openDelay = 500,
    closeDelay = 200,
    className,
    ...rest
  }: HoverCardWrapperProps) => {
    return (
      <HoverCard closeDelay={closeDelay} openDelay={openDelay}>
        <HoverCardTrigger>{children}</HoverCardTrigger>
        <HoverCardContent className={className} {...rest}>
          {hoverCardText}
        </HoverCardContent>
      </HoverCard>
    );
  }
);
HoverCardWrapper.displayName = 'HoverCardWrapper';

export default HoverCardWrapper;
