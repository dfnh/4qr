import { useTranslations } from 'next-intl';
import { memo, useCallback, useEffect } from 'react';
import { type GetTypeOfConst } from '~/typescript';
import { useFormContextQr } from '../helpers/useFormContextQr';
import { type OnSelectType } from '~/components/SelectWrapper';
import FormSelectOptions from './FormSelectOptions';

const dotTypes = [
  'dots',
  'rounded',
  'classy',
  'classy-rounded',
  'square',
  'extra-rounded',
] as const;
type DotTypes = GetTypeOfConst<typeof dotTypes>;

const SelectDots = memo(() => {
  const t = useTranslations('CreateQrPage.CardCreate.FormCreate.Options.Dots');
  const { register, setValue: sv } = useFormContextQr();

  useEffect(() => {
    register('dotsOptions.type');
  }, [register]);
  const onSelect = useCallback(
    (id: DotTypes) => {
      sv('dotsOptions.type', id);
    },
    [sv]
  );

  return (
    <FormSelectOptions
      label={t('label')}
      placeholder={t('placeholder')}
      defaultValue={dotTypes['4']}
      onSelected={onSelect as OnSelectType}
      name={'dotsOptions.type'}
      className="w-full"
      type={dotTypes}
    />
  );
});
SelectDots.displayName = 'SelectDots';

export default SelectDots;
