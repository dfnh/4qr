import { useTranslations } from 'next-intl';
import { CollapsibleWrapper } from '~/components/CollapsibleWrapper';
import InputWithLabel from '~/components/InputWithLabel';
import { useFormContextQr } from '../helpers/useFormContextQr';
import FormColorTypeChange from './FormColorTypeChange';
import FormInputFileImage from './FormInputFileImage';
import FormSwitch from './FormSwitch';
import SelectCornerDots from './SelectCornerDots';
import SelectCornerSquare from './SelectCornerSquare';
import SelectDots from './SelectDots';
import SelectErrorLevel from './SelectErrorLevel';
import SelectQrMode from './SelectQrMode';

const CreateFormOptions = () => {
  const t = useTranslations('CreateQrPage.CardCreate.FormCreate.Options');
  const {
    register,
    formState: { errors },
  } = useFormContextQr();

  return (
    <>
      <CollapsibleWrapper title={t('Main options')} className="grid gap-2" defaultIsOpen>
        <InputWithLabel
          id="width"
          labelText={t('Width.label')}
          placeholder={t('Width.placeholder')}
          type="number"
          register={register('width', { value: 300, valueAsNumber: true })}
          error={errors.width?.message}
        />

        <InputWithLabel
          id="height"
          labelText={t('Height.label')}
          placeholder={t('Height.placeholder')}
          type="number"
          register={register('height', { value: 300, valueAsNumber: true })}
          error={errors.height?.message}
        />

        <InputWithLabel
          id="margin"
          labelText={t('Margin.label')}
          placeholder={t('Margin.placeholder')}
          type="number"
          register={register('margin', { value: 1, valueAsNumber: true })}
          error={errors.margin?.message}
        />

        <FormInputFileImage />
      </CollapsibleWrapper>

      <CollapsibleWrapper title={t('Dots options')} className="grid gap-2">
        <SelectDots />
        <FormColorTypeChange name="dotsOptions" />
      </CollapsibleWrapper>

      <CollapsibleWrapper title={t('Corners square options')} className="grid gap-2">
        <SelectCornerSquare />
        <FormColorTypeChange name="cornersSquareOptions" />
      </CollapsibleWrapper>

      <CollapsibleWrapper title={t('Corners dot options')} className="grid gap-2">
        <SelectCornerDots />
        <FormColorTypeChange name="cornersDotOptions" />
      </CollapsibleWrapper>

      <CollapsibleWrapper title={t('Background options')} className="grid gap-2">
        <FormColorTypeChange name="backgroundOptions" />
      </CollapsibleWrapper>

      <CollapsibleWrapper title={t('Image options')} className="grid gap-2">
        <FormSwitch
          name="imageOptions.hideBackgroundDots"
          label={t('Image.SwitchLabel')}
        />

        <InputWithLabel
          id="imageOptions.imageSize"
          labelText={t('Image.Size.label')}
          placeholder={t('Image.Size.placeholder')}
          type="number"
          register={register('imageOptions.imageSize', {
            value: 0.4,
            valueAsNumber: true,
          })}
          error={errors.imageOptions?.imageSize?.message}
        />

        <InputWithLabel
          id="imageOptions.margin"
          labelText={t('Image.Margin.label')}
          placeholder={t('Image.Margin.placeholder')}
          type="number"
          register={register('imageOptions.margin', { value: 0, valueAsNumber: true })}
          error={errors.imageOptions?.margin?.message}
        />
      </CollapsibleWrapper>

      <CollapsibleWrapper title={t('Qr options')} className="grid gap-2">
        <InputWithLabel
          id="qrOptions.typeNumber"
          labelText={t('Version.label')}
          placeholder={t('Version.placeholder')}
          defaultValue={0}
          type="number"
          register={register('qrOptions.typeNumber', { value: 0, valueAsNumber: true })}
          error={errors.qrOptions?.typeNumber?.message}
        />
        <SelectQrMode />
        <SelectErrorLevel />
      </CollapsibleWrapper>
    </>
  );
};

export default CreateFormOptions;
