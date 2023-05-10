import { useFormContext } from 'react-hook-form';
import { Label } from '~/ui/label';
import { Textarea } from '~/ui/textarea';
import { ErrorSpan } from './ErrorSpan';
import { GeneratePassword } from './GeneratePassword';
import { Separator } from '~/ui/separator';
import { FormCreateOptions, FormSwitch } from './FormCreateOptions';

import { type QrFullSchema } from '~/schemas/QRCodeStyling';
import { useToast } from '~/hooks/useToast';
import { useSession } from 'next-auth/react';
import HoverCardWrapper from './HoverCardWrapper';

const FormCreate = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<QrFullSchema>();

  // todo add scrollbar
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

      <FormSwitchSlink />

      <GeneratePassword />

      <Separator className="my-2" />

      <FormCreateOptions />
    </form>
  );
};

const FormSwitchSlink = () => {
  const { status } = useSession();

  if (status === 'authenticated') {
    return <FormSwitch name="slink" label="Create short link" />;
  }
  return (
    <>
      <HoverCardWrapper hoverCardText="To create qr code with shorturl you need to sign in">
        <FormSwitch name="slink" label="Create short link" disabled />
      </HoverCardWrapper>
    </>
  );
};

export { FormCreate };
