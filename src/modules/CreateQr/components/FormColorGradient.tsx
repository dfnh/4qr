import { useTranslations } from 'next-intl';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { RadioItem } from '~/components/RadioItem';
import { Button, Input, Label, RadioGroup } from '~/ui';
import { useFormContextQr } from '../helpers/useFormContextQr';
import { type FieldsWithColor } from '../types/FieldsWithColor';

export type GradientType = 'radial' | 'linear';

const FormColorGradient = memo(({ name }: { name: FieldsWithColor }) => {
  const t = useTranslations('CreateQrPage.CardCreate.FormCreate.Options.Gradient');
  const { register, setValue, resetField } = useFormContextQr();
  const Name = useMemo(() => name, [name]);

  useEffect(() => {
    register(`${Name}.gradient.type`, { value: 'linear' });
  }, [Name, register]);
  const onValueChange = useCallback(
    (value: GradientType) => {
      setValue(`${Name}.gradient.type`, value);
    },
    [Name, setValue]
  );
  const onClickClear = useCallback(() => {
    resetField(`${Name}.gradient.colorStops.0.color`);
    resetField(`${Name}.gradient.colorStops.1.color`);
  }, [Name, resetField]);

  return (
    <>
      <RadioGroup
        id={`${Name}.gradient.type`}
        defaultValue="linear"
        onValueChange={onValueChange}
        className="my-1 flex space-x-2"
      >
        <Label htmlFor={`${Name}.gradient`}>{t('radio.label')}</Label>
        <div className="flex flex-wrap gap-2">
          <RadioItem
            id={`${Name}.gradient.linear`}
            value="linear"
            label={t('radio.linear')}
          />
          <RadioItem
            id={`${Name}.gradient.radial`}
            value="radial"
            label={t('radio.radial')}
          />
        </div>
      </RadioGroup>
      <Label htmlFor={`${Name}.gradient.rotation`}>{t('Rotation')}</Label>
      <Input
        id={`${Name}.gradient.rotation`}
        type="number"
        defaultValue={0}
        {...register(`${Name}.gradient.rotation`, { value: 0, valueAsNumber: true })}
      />
      <Label>{t('Colors')}</Label>
      <div className="flex justify-start">
        <div className="flex gap-2">
          <Input
            id={`${Name}.color`}
            type="color"
            className="w-16"
            {...register(`${Name}.gradient.colorStops.0.color`)}
          />
          <Input
            id={`${Name}.color`}
            type="color"
            className="w-16"
            {...register(`${Name}.gradient.colorStops.1.color`)}
          />
        </div>
        <Button type="button" className="ml-auto" onClick={onClickClear}>
          {t('clear')}
        </Button>
      </div>
    </>
  );
});
FormColorGradient.displayName = 'FormColorGradient';

export default FormColorGradient;
