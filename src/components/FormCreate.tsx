import { memo } from 'react';
import { useFormContext } from 'react-hook-form';
import { type CreateQrSchema } from '~/schemas/createQr';
import { Label } from '~/ui/label';
import { Textarea } from '~/ui/textarea';

const FormCreate = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateQrSchema>();
  // todo add scrollbar
  return (
    <form className="grid gap-2">
      <Label htmlFor="data">Data</Label>
      <Textarea
        id="data"
        className="max-h-[10.5rem] min-h-[10.5rem]"
        placeholder="data for qr code"
        {...register('text')}
      />
      {errors.text?.message && <ErrorSpan>{errors.text.message}</ErrorSpan>}
      {/* {Object.keys(errors).map((e) => (
        <p key={e}>{e}</p>
      ))} */}
    </form>
  );
};

const _ErrorSpan = ({ children, message }: { children?: string; message?: string }) => {
  return (
    <span role="alert" className="text-red-600">
      {message ?? children}
    </span>
  );
};

export const ErrorSpan = memo(_ErrorSpan);

export { FormCreate };
