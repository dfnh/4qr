import { memo, useCallback, useEffect } from 'react';
import { type GetTypeOfConst } from '~/typescript';
import { useFormContextQr } from '../helpers/useFormContextQr';
import { useTranslations } from 'next-intl';
import FormSelectOptions, { type OnSelectType } from './FormSelectOptions';

const errorCorrectionLevel = ['L', 'M', 'Q', 'H'] as const;
type ErrorCorrectionLevel = GetTypeOfConst<typeof errorCorrectionLevel>;

const SelectErrorLevel = memo(() => {
  const t = useTranslations('CreateQrPage.CardCreate.FormCreate.Options.ErrorLevel');
  const { register, setValue: sv } = useFormContextQr();

  useEffect(() => {
    register('qrOptions.errorCorrectionLevel');
  }, [register]);
  const onSelect = useCallback(
    (id: ErrorCorrectionLevel) => {
      sv('qrOptions.errorCorrectionLevel', id);
    },
    [sv]
  );

  return (
    <FormSelectOptions
      label={t('label')}
      placeholder={t('placeholder')}
      defaultValue={errorCorrectionLevel['2']}
      onSelected={onSelect as OnSelectType}
      name={'qrOptions.errorCorrectionLevel'}
      className="w-full"
      type={errorCorrectionLevel}
    />
  );
});
SelectErrorLevel.displayName = 'SelectErrorLevel';

export default SelectErrorLevel;
