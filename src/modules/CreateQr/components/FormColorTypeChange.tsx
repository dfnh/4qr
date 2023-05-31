import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { RadioItem } from '~/components/RadioItem';
import { Label, RadioGroup } from '~/ui';
import { useFormContextQr } from '../helpers/useFormContextQr';
import { type FieldsWithColor } from '../types/FieldsWithColor';
import FormColorGradient from './FormColorGradient';
import FormColorSingle from './FormColorSingle';

const FormColorTypeChange = ({ name }: { name: FieldsWithColor }) => {
  const t = useTranslations('CreateQrPage.CardCreate.FormCreate.Options');
  const { setValue } = useFormContextQr();
  const [single, setSingle] = useState(true);

  const onValueChange = (value: string) => {
    if (value === 'single') {
      setSingle(true);
      setValue(`${name}.gradient`, undefined);
    } else {
      setSingle(false);
      setValue(`${name}.color`, undefined);
    }
  };

  return (
    <>
      <RadioGroup
        id={`${name}.colorType`}
        onValueChange={onValueChange}
        defaultValue="single"
        className="my-1 flex space-x-2"
      >
        <Label>{t('ColorChange.label')}</Label>
        <div className="flex flex-wrap gap-2">
          <RadioItem
            id={`${name}.colorType.single`}
            value="single"
            label={t('ColorChange.single')}
          />
          <RadioItem
            id={`${name}.colorType.gradient`}
            value="gradient"
            label={t('ColorChange.gradient')}
          />
        </div>
      </RadioGroup>
      {single ? (
        <FormColorSingle
          label={t('Single.Color')}
          clear={t('Single.Clear')}
          name={name}
        />
      ) : (
        <FormColorGradient name={name} />
      )}
    </>
  );
};

export default FormColorTypeChange;
