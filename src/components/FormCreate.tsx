import { useFormContext } from 'react-hook-form';
import { Label } from '~/ui/label';
import { Textarea } from '~/ui/textarea';
import { ErrorSpan } from './ErrorSpan';
import { GeneratePassword } from './GeneratePassword';
import { Separator } from '~/ui/separator';
import { FormCreateOptions, FormSwitch } from './FormCreateOptions';

import { type QrFullSchema } from '~/schemas/QRCodeStyling';

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

      <FormSwitch name="slink" label="Create short link" />

      <GeneratePassword />

      <Separator className="my-2" />

      <FormCreateOptions />
    </form>
  );
};

export { FormCreate };
