import { useTranslations } from 'next-intl';
import { memo, useCallback, useEffect } from 'react';
import { type GetTypeOfConst } from '~/typescript';
import { useFormContextQr } from '../helpers/useFormContextQr';
import FormSelectOptions, { type OnSelectType } from './FormSelectOptions';

const cornerDotTypes = ['dot', 'square', 'none'] as const;
type CornerDotTypes = GetTypeOfConst<typeof cornerDotTypes>;

const SelectCornerDots = memo(() => {
  const t = useTranslations('CreateQrPage.CardCreate.FormCreate.Options.CornerDots');
  const { register, setValue: sv } = useFormContextQr();

  useEffect(() => {
    register('cornersDotOptions.type');
  }, [register]);
  const onSelect = useCallback(
    (id: CornerDotTypes) => {
      const t = id === 'none' ? undefined : id;
      sv('cornersDotOptions.type', t);
    },
    [sv]
  );

  return (
    <FormSelectOptions
      label={t('label')}
      placeholder={t('placeholder')}
      defaultValue={cornerDotTypes['2']}
      onSelected={onSelect as OnSelectType}
      name={'cornersDotOptions.type'}
      className="w-full"
      type={cornerDotTypes}
    />
  );
});
SelectCornerDots.displayName = 'SelectCornerDots';

export default SelectCornerDots;
