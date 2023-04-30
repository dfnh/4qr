import { useFormContext, Controller } from 'react-hook-form';
import { type CreateQrSchema } from '~/schemas/createQr';
import { Label } from '~/ui/label';
import { Switch } from '~/ui/switch';
import { Textarea } from '~/ui/textarea';
import { ErrorSpan } from './ErrorSpan';
import { GeneratePassword } from './GeneratePassword';

const FormCreate = () => {
  const {
    register,
    control,
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
      <div className="flex items-center space-x-2">
        <Controller
          name="slink"
          control={control}
          render={({ field: { onChange, ref } }) => (
            <Switch id="slink" ref={ref} onCheckedChange={(v) => onChange(v)} />
          )}
        />
        <Label htmlFor="slink">Create short link</Label>
      </div>

      <GeneratePassword />
    </form>
  );
};

export { FormCreate };
