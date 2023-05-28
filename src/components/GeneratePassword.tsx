import { memo, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { generate } from '~/helpers/generate';
import { useToast } from '~/hooks/useToast';
import { type CreateQrSchema } from '~/schemas/createQr';
import { Button } from '~/ui/button';
import { Input } from '~/ui/input';
import { Label } from '~/ui/label';
import { ErrorSpan } from './ErrorSpan';
import { useTranslations } from 'next-intl';

type GeneratePasswordProps = {
  isAuthed: boolean;
  disabled?: boolean;
};
const GeneratePassword = memo(
  ({ isAuthed = true, disabled: dis = false }: GeneratePasswordProps) => {
    const t = useTranslations('CreateQrPage.CardCreate.FormCreate.GeneratePassword');
    const {
      register,
      setValue,
      watch,
      formState: { errors },
    } = useFormContext<CreateQrSchema>();
    const { toast } = useToast();
    const sign = watch('sign');

    useEffect(() => {
      if (sign) {
        setValue('password', undefined);
      }
    }, [setValue, sign]);

    const disabled = !isAuthed || dis || sign;

    const generatePassword = async () => {
      if (sign) {
        // setValue('password', undefined);
        toast({
          title: t('toast.sign.title'),
          description: t('toast.sign.description'),
        });
        return;
      }
      if (disabled) {
        toast({
          title: t('toast.disabled.title'),
          description: t('toast.disabled.description'),
        });
        setValue('password', undefined);
        return;
      }
      const password = await generate();
      setValue('password', password);
      setValue('sign', false);
    };

    return (
      <>
        <Label htmlFor="password">{t('label')}</Label>
        <div className="flex w-full items-center space-x-2">
          <Input
            id="password"
            type="text"
            placeholder={t('placeholder')}
            disabled={disabled}
            {...register('password')}
          />
          <Button type="button" variant="default" onClick={generatePassword}>
            {t('Generate')}
          </Button>
        </div>
        {errors.password?.message && <ErrorSpan>{errors.password.message}</ErrorSpan>}
      </>
    );
  }
);
GeneratePassword.displayName = 'GeneratePassword';

export { GeneratePassword };
