import { memo, useEffect } from 'react';
import { useFormContextQr } from '../helpers/useFormContextQr';
import FormSwitchMain, { type FormSwitchMainProps } from './FormSwitchMain';

type FormSwitchSlinkProps = Omit<FormSwitchMainProps, 'name'>;

const FormSwitchSlink = memo(
  ({ hoverCardText, label, isAuthed = true }: FormSwitchSlinkProps) => {
    const { watch, setValue } = useFormContextQr();
    const sign = watch('sign');
    const slink = watch('slink');

    useEffect(() => {
      if (sign) {
        setValue('slink', true);
      }
    }, [setValue, sign]);
    useEffect(() => {
      if (!slink) {
        setValue('sign', false);
      }
    }, [setValue, slink]);

    return (
      <FormSwitchMain
        name="slink"
        label={label}
        isAuthed={isAuthed}
        hoverCardText={hoverCardText}
      />
    );
  }
);
FormSwitchSlink.displayName = 'FormSwitchSlink';

export default FormSwitchSlink;
