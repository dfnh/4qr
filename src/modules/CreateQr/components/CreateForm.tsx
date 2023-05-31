import { useTranslations } from 'next-intl';
import { ErrorSpan } from '~/components/ErrorSpan';
import { Label } from '~/ui/label';
import { Separator } from '~/ui/separator';
import { Textarea } from '~/ui/textarea';
import { useFormContextQr } from '../helpers/useFormContextQr';
import CreateFormMain from './CreateFormMain';
import CreateFormOptions from './CreateFormOptions';

const CreateForm = () => {
  const t = useTranslations('CreateQrPage.CardCreate.FormCreate.Data');
  const {
    register,
    formState: { errors },
  } = useFormContextQr();

  return (
    <form className="grid gap-2">
      <Label htmlFor="data">{t('label')}</Label>
      <Textarea
        id="data"
        className="resize-none"
        placeholder={t('placeholder')}
        {...register('data')}
      />
      {errors.data?.message && <ErrorSpan>{errors.data.message}</ErrorSpan>}

      <CreateFormMain />
      <Separator className="my-2" />
      <CreateFormOptions />
    </form>
  );
};

export default CreateForm;
