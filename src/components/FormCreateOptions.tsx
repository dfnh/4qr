import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { type QrFullSchema } from '~/schemas/QRCodeStyling';
import type { GetTypeOfConst } from '~/typescript';
import { Button } from '~/ui/button';
import { Input } from '~/ui/input';
import { Label } from '~/ui/label';
import { Switch } from '~/ui/switch';
import { CollapsibleWrapper } from './CollapsibleWrapper';
import InputWithLabel from './InputWithLabel';
import { RadioGroup, RadioItem } from './RadioItem';
import {
  SelectItem,
  SelectWrapper,
  type OnSelectType,
  type SelectWrapperProps,
} from './SelectWrapper';
import { useTranslations } from 'next-intl';

const FormCreateOptions = () => {
  const t = useTranslations('CreateQrPage.CardCreate.FormCreate.Options');
  const {
    register,
    formState: { errors },
  } = useFormContext<QrFullSchema>();

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
          register={register('margin', { value: 0, valueAsNumber: true })}
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
        <FormSwitch name="imageOptions.hideBackgroundDots" label="Hide background dots" />

        <InputWithLabel
          labelText="Image size"
          id="imageOptions.imageSize"
          placeholder="image size"
          type="number"
          register={register('imageOptions.imageSize', {
            value: 0.4,
            valueAsNumber: true,
          })}
          error={errors.imageOptions?.imageSize?.message}
        />

        <InputWithLabel
          labelText="Image margin"
          id="imageOptions.margin"
          placeholder="image margin"
          type="number"
          register={register('imageOptions.margin', { value: 0, valueAsNumber: true })}
          error={errors.imageOptions?.margin?.message}
        />
      </CollapsibleWrapper>

      <CollapsibleWrapper title={t('Qr options')} className="grid gap-2">
        <InputWithLabel
          labelText="Version"
          id="qrOptions.typeNumber"
          placeholder="type number"
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

const FormInputFileImage = () => {
  const t = useTranslations('CreateQrPage.CardCreate.FormCreate.Options.InputFile');
  const { register, resetField, setValue } = useFormContext<QrFullSchema>();
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

type FormSelectOptions = { label: string } & FormSelectTypeItemsProps &
  Required<
    Pick<SelectWrapperProps, 'placeholder' | 'defaultValue' | 'onSelected' | 'name'>
  > &
  Pick<SelectWrapperProps, 'className'>;
const FormSelectOptions = memo((props: FormSelectOptions) => {
  return (
    <>
      <Label>{props.label}</Label>
      <SelectWrapper
        placeholder={props.placeholder}
        defaultValue={props.defaultValue}
        onSelected={props.onSelected}
        name={props.name}
        className={props.className}
      >
        <FormSelectTypeItems type={props.type} />
      </SelectWrapper>
    </>
  );
});
FormSelectOptions.displayName = 'FormSelectOptions';

const errorCorrectionLevel = ['L', 'M', 'Q', 'H'] as const;
type ErrorCorrectionLevel = GetTypeOfConst<typeof errorCorrectionLevel>;
const SelectErrorLevel = memo(() => {
  const t = useTranslations('CreateQrPage.CardCreate.FormCreate.Options.ErrorLevel');
  const { register, setValue: sv } = useFormContext<QrFullSchema>();

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

const qrMode = ['Numeric', 'Alphanumeric', 'Byte', 'Kanji'] as const;
type QrMode = GetTypeOfConst<typeof qrMode>;
const SelectQrMode = memo(() => {
  const t = useTranslations('CreateQrPage.CardCreate.FormCreate.Options.QrMode');
  const { register, setValue: sv } = useFormContext<QrFullSchema>();

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

const cornerSquareTypes = ['dot', 'square', 'extra-rounded', 'none'] as const;
type CornerSquareTypes = GetTypeOfConst<typeof cornerSquareTypes>;
const SelectCornerSquare = memo(() => {
  const t = useTranslations('CreateQrPage.CardCreate.FormCreate.Options.CornerSquare');
  const { register, setValue: sv } = useFormContext<QrFullSchema>();

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

const cornerDotTypes = ['dot', 'square', 'none'] as const;
type CornerDotTypes = GetTypeOfConst<typeof cornerDotTypes>;
const SelectCornerDots = memo(() => {
  const t = useTranslations('CreateQrPage.CardCreate.FormCreate.Options.CornerDots');
  const { register, setValue: sv } = useFormContext<QrFullSchema>();

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

type FormSelectTypeItemsProps = {
  type: [string, ...string[]] | Readonly<[string, ...string[]]>;
};
const FormSelectTypeItems = memo(({ type }: FormSelectTypeItemsProps) => {
  return (
    <>
      {type.map((d) => (
        <SelectItem key={d} value={d}>
          {d}
        </SelectItem>
      ))}
    </>
  );
});
FormSelectTypeItems.displayName = 'FormSelectTypeItems';

const dotTypes = [
  'dots',
  'rounded',
  'classy',
  'classy-rounded',
  'square',
  'extra-rounded',
] as const;
type DotTypes = GetTypeOfConst<typeof dotTypes>;
export const SelectDots = memo(() => {
  const t = useTranslations('CreateQrPage.CardCreate.FormCreate.Options.Dots');
  const { register, setValue: sv } = useFormContext<QrFullSchema>();

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

const FormColorTypeChange = ({ name }: { name: FieldsWithColor }) => {
  const t = useTranslations('CreateQrPage.CardCreate.FormCreate.Options');
  const { setValue } = useFormContext<QrFullSchema>();
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

const defaultFieldColor = new Map<FieldsWithColor, string>([
  ['backgroundOptions', '#ffffff'],
]);

const fieldsWithColor = [
  'dotsOptions',
  'cornersDotOptions',
  'cornersSquareOptions',
  'backgroundOptions',
] as const;
type GradientType = 'radial' | 'linear';
type FieldsWithColor = GetTypeOfConst<typeof fieldsWithColor>;
const FormColorGradient = memo(({ name }: { name: FieldsWithColor }) => {
  const t = useTranslations('CreateQrPage.CardCreate.FormCreate.Options.Gradient');
  const { register, setValue, resetField } = useFormContext<QrFullSchema>();
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

type FormColorSingleProps = {
  name: FieldsWithColor;
  label: string;
  clear: string;
};
const FormColorSingle = ({ name, label, clear }: FormColorSingleProps) => {
  const { register, setValue } = useFormContext<QrFullSchema>();
  const onClickClear = () => {
    setValue(`${name}.color`, undefined);
  };

  return (
    <div className="flex justify-start">
      <span>
        <Label htmlFor={`${name}.color`}>{label}</Label>
        <Input
          id={`${name}.color`}
          type="color"
          className="mt-1 w-32"
          {...register(`${name}.color`, {
            value: defaultFieldColor.get(name) ?? '#000000',
          })}
        />
      </span>
      <Button type="button" className="ml-auto self-end" onClick={onClickClear}>
        {clear}
      </Button>
    </div>
  );
};

type FormSwitchProps = {
  name: string;
  label: string;
  disabled?: boolean;
};
export const FormSwitch = ({ name, label, disabled = false }: FormSwitchProps) => {
  const { control } = useFormContext();
  return (
    <div className="flex items-center space-x-2">
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, ref, value } }) => (
          <Switch
            id={name}
            ref={ref}
            checked={value as boolean | undefined}
            onCheckedChange={(v) => onChange(v)}
            disabled={disabled}
          />
        )}
      />
      <Label htmlFor={name}>{label}</Label>
    </div>
  );
}; // FormSwitch.displayName = 'FormSwitch';

export { FormCreateOptions };
