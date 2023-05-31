import { useTranslations } from 'next-intl';
import { memo, useCallback, useEffect } from 'react';
import { type GetTypeOfConst } from '~/typescript';
import { useFormContextQr } from '../helpers/useFormContextQr';
import FormSelectOptions, { type OnSelectType } from './FormSelectOptions';

const cornerSquareTypes = ['dot', 'square', 'extra-rounded', 'none'] as const;
type CornerSquareTypes = GetTypeOfConst<typeof cornerSquareTypes>;

const SelectCornerSquare = memo(() => {
  const t = useTranslations('CreateQrPage.CardCreate.FormCreate.Options.CornerSquare');
  const { register, setValue: sv } = useFormContextQr();

  useEffect(() => {
    register('cornersSquareOptions.type');
  }, [register]);
  const onSelect = useCallback(
    (id: CornerSquareTypes) => {
      const t = id === 'none' ? undefined : id;
      sv('cornersSquareOptions.type', t);
    },
    [sv]
  );

  return (
    <FormSelectOptions
      label={t('label')}
      placeholder={t('placeholder')}
      defaultValue={cornerSquareTypes['3']}
      onSelected={onSelect as OnSelectType}
      name={'cornersSquareOptions.type'}
      className="w-full"
      type={cornerSquareTypes}
    />
  );
});
SelectCornerSquare.displayName = 'SelectCornerSquare';

export default SelectCornerSquare;
