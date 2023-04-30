import { Input } from '~/ui/input';
import { Label } from '~/ui/label';
import { Button } from '~/ui/button';
import { useForm } from 'react-hook-form';
import { ErrorSpan } from '~/components/ErrorSpan';
import { schemaForForm, type SchemaForForm } from '~/schemas/codeProcedure';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSlinkAtom } from '~/store/hooks';
import { api } from '~/utils/api';

const FormPartOfSlink = ({ slink }: { slink: string }) => {
  const {
    register,
    handleSubmit,
    setError,
    resetField,
    formState: { errors },
  } = useForm<SchemaForForm>({
    resolver: zodResolver(schemaForForm),
    mode: 'onBlur',
  });
  const [_, setSlinkAtom] = useSlinkAtom();

  const { mutate } = api.qr.getSlinkWithPass.useMutation({
    onSuccess(data) {
      setSlinkAtom(data);
    },
    onError() {
      resetField('password', { keepDirty: false, keepTouched: false });
      setError('password', { message: 'Wrong password' });
    },
  });

  const onSubmit = (p: SchemaForForm) => {
    mutate({ slink, ...p });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="password">Password</Label>
        <div className="flex w-full items-center space-x-2">
          <Input id="password" type="text" {...register('password')} />
          <Button type="submit" variant="default">
            Send
          </Button>
        </div>
        {errors.password?.message && <ErrorSpan>{errors.password.message}</ErrorSpan>}
      </form>
    </>
  );
};

export { FormPartOfSlink };
