import { memo } from 'react';
import { useFormContext } from 'react-hook-form';
import { generate } from '~/helpers/generate';
import { useToast } from '~/hooks/useToast';
import { type CreateQrSchema } from '~/schemas/createQr';
import { Button } from '~/ui/button';
import { Input } from '~/ui/input';
import { Label } from '~/ui/label';
import { ErrorSpan } from './ErrorSpan';

const GeneratePassword = memo(({ isAuthed = true }: { isAuthed: boolean }) => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<CreateQrSchema>();

  const { toast } = useToast();

  const generatePassword = async () => {
    if (!isAuthed) {
      toast({
        title: 'You are not authenticated',
        description: 'To create qr code with password you need to sign in',
      });
      setValue('password', undefined);
      return;
    }
    const password = await generate();
    setValue('password', password);
  };

  return (
    <>
      <Label htmlFor="password">Password</Label>
      <div className="flex w-full items-center space-x-2">
        <Input
          id="password"
          type="text"
          placeholder="set or generate password"
          disabled={!isAuthed}
          {...register('password')}
        />
        <Button type="button" variant="default" onClick={generatePassword}>
          Generate
        </Button>
      </div>
      {errors.password?.message && <ErrorSpan>{errors.password.message}</ErrorSpan>}
    </>
  );
});
GeneratePassword.displayName = 'GeneratePassword';

export { GeneratePassword };
