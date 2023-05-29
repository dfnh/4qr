import { useTranslations } from 'next-intl';
import { memo } from 'react';
import { ErrorSpan } from '~/components/ErrorSpan';
import { useZodForm } from '~/hooks/useZodForm';
import {
  schemaForFormPublicKey,
  type SchemaForFormPublicKey,
} from '~/schemas/codeProcedure';
import { useSetSlinkAtom } from '~/store/hooks';
import { Button } from '~/ui/button';
import { Label } from '~/ui/label';
import { Textarea } from '~/ui/textarea';
import { api } from '~/utils/api';

const WithSignature = memo(({ slink }: { slink: string }) => {
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
});
WithSignature.displayName = 'WithSignature';

export default WithSignature;
