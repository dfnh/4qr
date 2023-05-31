import { memo } from 'react';
import HoverCardWrapper from '~/components/HoverCardWrapper';
import FormSwitch, { type FormSwitchProps } from './FormSwitch';

export type FormSwitchMainProps = {
  isAuthed: boolean;
  hoverCardText: string;
} & Omit<FormSwitchProps, 'disabled'>;

const FormSwitchMain = memo(
  ({ hoverCardText, label, name, isAuthed = true }: FormSwitchMainProps) => {
    return (
      <HoverCardWrapper
        className="text-sm"
        openDelay={!isAuthed ? 200 : undefined}
        hoverCardText={hoverCardText}
      >
        <FormSwitch name={name} label={label} disabled={!isAuthed} />
      </HoverCardWrapper>
    );
  }
);
FormSwitchMain.displayName = 'FormSwitchMain';

export default FormSwitchMain;
