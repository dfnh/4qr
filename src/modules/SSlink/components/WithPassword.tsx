import { useTranslations } from 'next-intl';
import { memo } from 'react';
import { ErrorSpan } from '~/components/ErrorSpan';
import { useZodForm } from '~/hooks/useZodForm';
import {
  schemaForFormPassword,
  type SchemaForFormPassword,
} from '~/schemas/codeProcedure';
import { useSetSlinkAtom } from '~/store/hooks';
import { Button } from '~/ui/button';
import { Input } from '~/ui/input';
import { Label } from '~/ui/label';
import { api } from '~/utils/api';

const WithPassword = memo(({ slink }: { slink: string }) => {
  const t = useTranslations('SSlinkPage.WithPassword');
  const {
    register,
    handleSubmit,
    setError,
    resetField,
    formState: { errors },
  } = useZodForm({ schema: schemaForFormPassword, mode: 'onBlur' });

  const setSlinkAtom = useSetSlinkAtom();

  const { mutate } = api.qr.getSlinkWithPass.useMutation({
    onSuccess(data) {
      setSlinkAtom(data);
    },
    onError() {
      resetField('password', { keepDirty: false, keepTouched: false });
      setError('password', { message: t('error.Wrong password') });
    },
  });

  const onSubmit = (p: SchemaForFormPassword) => {
    mutate({ slink, ...p });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Label htmlFor="password">{t('Password')}</Label>
      <div className="flex w-full items-center space-x-2">
        <Input id="password" type="text" {...register('password')} />
        <Button type="submit" variant="default">
          {t('Send')}
        </Button>
      </div>
      {errors.password?.message && <ErrorSpan>{errors.password.message}</ErrorSpan>}
    </form>
  );
});
WithPassword.displayName = 'WithPassword'

export default WithPassword;
