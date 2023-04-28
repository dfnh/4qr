import { useSession } from 'next-auth/react';
import { memo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { generate } from '~/helpers/generate';
import { useToast } from '~/hooks/useToast';
import { type CreateQrSchema } from '~/schemas/createQr';
import { Button } from '~/ui/button';
import { Input } from '~/ui/input';
import { Label } from '~/ui/label';
import { Switch } from '~/ui/switch';
import { Textarea } from '~/ui/textarea';

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

      <InputsThatNeedUser />
    </form>
  );
};

const InputsThatNeedUser = () => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<CreateQrSchema>();

  const { status } = useSession();
  const { toast } = useToast();

  const generatePassword = async () => {
    if (status !== 'authenticated') {
      toast({
        title: 'You are not authenticated',
        description: 'To create qr code with password you need to sign in',
      });
      setValue('password', undefined);
      // setError('password', { message: 'to use password u need to sign in' });
      return;
    }
    const password = await generate();
    setValue('password', password);
  };

  return (
    <>
      <Label htmlFor="password">Password</Label>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          id="password"
          type="text"
          placeholder="set or generate password"
          disabled={status !== 'authenticated'}
          {...register('password')}
        />
        <Button type="button" variant="default" onClick={generatePassword}>
          Generate
        </Button>
      </div>
      {errors.password?.message && <ErrorSpan>{errors.password.message}</ErrorSpan>}
    </>
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
