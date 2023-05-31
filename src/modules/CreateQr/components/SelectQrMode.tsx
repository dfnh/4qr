import { useTranslations } from 'next-intl';
import { memo, useCallback, useEffect } from 'react';
import { type GetTypeOfConst } from '~/typescript';
import { useFormContextQr } from '../helpers/useFormContextQr';
import FormSelectOptions, { type OnSelectType } from './FormSelectOptions';

const qrMode = ['Numeric', 'Alphanumeric', 'Byte', 'Kanji'] as const;
type QrMode = GetTypeOfConst<typeof qrMode>;

const SelectQrMode = memo(() => {
  const t = useTranslations('CreateQrPage.CardCreate.FormCreate.Options.QrMode');
  const { register, setValue: sv } = useFormContextQr();

  useEffect(() => {
    register('qrOptions.mode');
  }, [register]);
  const onSelect = useCallback(
    (id: QrMode) => {
      sv('qrOptions.mode', id);
    },
    [sv]
  );

  return (
    <FormSelectOptions
      label={t('label')}
      placeholder={t('placeholder')}
      defaultValue={qrMode['2']}
      onSelected={onSelect as OnSelectType}
      name={'qrOptions.mode'}
      className="w-full"
      type={qrMode}
    />
  );
});
SelectQrMode.displayName = 'SelectQrMode';

export default SelectQrMode;
