import { useSession } from 'next-auth/react';
import { memo, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { type QrFullSchema } from '~/schemas/QRCodeStyling';
import { Label } from '~/ui/label';
import { Separator } from '~/ui/separator';
import { Textarea } from '~/ui/textarea';
import { ErrorSpan } from './ErrorSpan';
import { FormCreateOptions, FormSwitch } from './FormCreateOptions';
import { GeneratePassword } from './GeneratePassword';
import HoverCardWrapper from './HoverCardWrapper';

const FormCreate = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<QrFullSchema>();

  return (
    <form className="grid gap-2">
      <Label htmlFor="data">Data</Label>
      <Textarea
        id="data"
        className="resize-none"
        placeholder="data for qr code"
        {...register('data')}
      />
      {errors.data?.message && <ErrorSpan>{errors.data.message}</ErrorSpan>}

      <FormCreateMainBusiness />

      <Separator className="my-2" />

      <FormCreateOptions />
    </form>
  );
};

const FormCreateMainBusiness = () => {
  const { status } = useSession();

  const isAuthed = useMemo(() => status === 'authenticated', [status]);

  return (
    <>
      <FormSwitchSlink isAuthed={isAuthed} />
      <FormSwitchSign isAuthed={isAuthed} />
      <GeneratePassword isAuthed={isAuthed} />
    </>
  );
};

const FormSwitchSlink = memo(({ isAuthed = true }: { isAuthed: boolean }) => {
  const { watch, setValue } = useFormContext<QrFullSchema>();

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
    <HoverCardWrapper
      openDelay={!isAuthed ? 200 : undefined}
      hoverCardText={formSwitchSlinkHoverMap.get(isAuthed)}
    >
      <FormSwitch name="slink" label="Create short link" disabled={!isAuthed} />
    </HoverCardWrapper>
  );
});
FormSwitchSlink.displayName = 'FormSwitchSlink';
const formSwitchSlinkHoverMap = new Map([
  [
    true,
    'This feature creates a short URL that represents the data provided in your QR code',
  ],
  [false, 'To create qr code with short URL you need to sign in'],
]);

const FormSwitchSign = memo(({ isAuthed = true }: { isAuthed: boolean }) => {
  return (
    <HoverCardWrapper
      openDelay={!isAuthed ? 200 : undefined}
      hoverCardText={formSwitchSignHoverMap.get(isAuthed)}
    >
      <FormSwitch name="sign" label="Sign data" disabled={!isAuthed} />
    </HoverCardWrapper>
  );
});
FormSwitchSign.displayName = 'FormSwitchSign';
const formSwitchSignHoverMap = new Map([
  [
    true,
    'Your data will be signed with a unique key pair that only you possess. This provides an additional layer of security and ensures that your data remains the same',
  ],
  [false, 'To sign your data with unique key pair you need to sign in'],
]);

export default FormCreate;
