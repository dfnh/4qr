import { useTranslations } from 'next-intl';
import { type ChangeEvent, useEffect, useRef } from 'react';
import { useFormContextQr } from '../helpers/useFormContextQr';
import { Button, Input, Label } from '~/ui';

const FormInputFileImage = () => {
  const t = useTranslations('CreateQrPage.CardCreate.FormCreate.Options.InputFile');
  const { register, resetField, setValue } = useFormContextQr();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    register('image');
  }, [register]);

  const resetFile = () => {
    resetField('image');
    if (!inputRef.current) return;
    inputRef.current.value = '';
  };
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const image = URL.createObjectURL(file);
    setValue('image', image);
  };

  return (
    <>
      <Label htmlFor="imageLogo">{t('label')}</Label>
      <div className="flex w-full items-center space-x-2">
        <Input
          id="imageLogo"
          type="file"
          accept="image/*"
          name="image"
          onChange={handleImageChange}
          ref={inputRef}
        />
        <Button type="button" variant="default" onClick={resetFile}>
          {t('Cancel')}
        </Button>
      </div>
    </>
  );
};

export default FormInputFileImage;
