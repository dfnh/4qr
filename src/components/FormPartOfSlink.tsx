import { Input } from '~/ui/input';
import { Label } from '~/ui/label';
import { Button } from '~/ui/button';
import { ErrorSpan } from '~/components/ErrorSpan';
import {
  schemaForFormPassword,
  type SchemaForFormPassword,
  schemaForFormPublicKey,
  type SchemaForFormPublicKey,
} from '~/schemas/codeProcedure';
import { useSetSlinkAtom } from '~/store/hooks';
import { api } from '~/utils/api';
import { useZodForm } from '~/hooks/useZodForm';
import { Textarea } from '~/ui/textarea';
import { useTranslations } from 'next-intl';

const FormPartOfSlinkPassword = ({ slink }: { slink: string }) => {
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
    <>
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
    </>
  );
};

const FormPartOfSlinkSignature = ({ slink }: { slink: string }) => {
  const t = useTranslations('SSlinkPage.WithSignature');
  const {
    handleSubmit,
    register,
    resetField,
    setError,
    formState: { errors },
  } = useZodForm({ schema: schemaForFormPublicKey, mode: 'all' });

  const setSlinkAtom = useSetSlinkAtom();

  const { mutate, isLoading } = api.qr.getSlinkWithSignature.useMutation({
    onSuccess(data) {
      setSlinkAtom(data);
    },
    onError() {
      resetField('publicKey', { keepDirty: false, keepTouched: false });
      setError('publicKey', { message: t('error.Wrong public key') });
    },
  });

  const onSubmit = (p: SchemaForFormPublicKey) => {
    mutate({ slink, publicKey: p.publicKey });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="publicKey">{t('Public key')}</Label>
        <div className="flex w-full items-center space-x-2">
          <Textarea id="publicKey" {...register('publicKey')} />
          <Button type="submit" variant="default" disabled={isLoading}>
            {t('Send')}
          </Button>
        </div>
        {errors.publicKey?.message && <ErrorSpan>{errors.publicKey.message}</ErrorSpan>}
      </form>
    </>
  );
};

export { FormPartOfSlinkPassword, FormPartOfSlinkSignature };
