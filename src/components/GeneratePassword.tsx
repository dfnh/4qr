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
    const slink = watch('slink');

    useEffect(() => {
      if (sign || !slink) {
        setValue('password', undefined);
      }
    }, [setValue, sign, slink]);

    const disabled = !isAuthed || dis || !!sign || !slink;

    const generatePassword = async () => {
      if (!isAuthed) {
        toast({
          title: t('toast.notAuthed.title'),
          description: t('toast.notAuthed.description'),
        });
        setValue('password', undefined);
        return;
      }
      if (!slink) {
        toast({
          title: t('toast.notSlink.title'),
          description: t('toast.notSlink.description'),
        });
        setValue('password', undefined);
        return;
      }
      if (sign) {
        toast({
          title: t('toast.sign.title'),
          description: t('toast.sign.description'),
        });
        setValue('password', undefined);
        return;
      }

      const password = await generate();
      setValue('password', password);
      setValue('sign', false);
      setValue('slink', true);
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
