import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import { Controller, useFormContext, type UseFormRegisterReturn } from 'react-hook-form';
import { type QrFullSchema } from '~/schemas/QRCodeStyling';
import type { GetTypeOfConst } from '~/typescript';
import { Button } from '~/ui/button';
import { Input, type InputProps } from '~/ui/input';
import { Label } from '~/ui/label';
import { Switch } from '~/ui/switch';
import { CollapsibleWrapper } from './CollapsibleWrapper';
import { RadioGroup, RadioItem } from './RadioItem';
import { SelectItem, SelectWrapper, type OnSelectType } from './SelectWrapper';
import InputWithLabel from './InputWithLabel';

const FormCreateOptions = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<QrFullSchema>();

  return (
    <>
      <CollapsibleWrapper title="Main options" className="grid gap-2" defaultIsOpen>
        <InputWithLabel
          labelText="Width"
          id="width"
          placeholder="width"
          type="number"
          register={register('width', { value: 300, valueAsNumber: true })}
          error={errors.width?.message}
        />

        <InputWithLabel
          labelText="Height"
          id="height"
          placeholder="height"
          type="number"
          register={register('height', { value: 300, valueAsNumber: true })}
          error={errors.height?.message}
        />

        <InputWithLabel
          labelText="Margin"
          id="margin"
          placeholder="margin"
          type="number"
          register={register('margin', { value: 0, valueAsNumber: true })}
          error={errors.margin?.message}
        />

        <FormInputFileImage />
      </CollapsibleWrapper>

      <CollapsibleWrapper title="Dots options" className="grid gap-2">
        <SelectDots />
        <FormColorTypeChange name="dotsOptions" />
      </CollapsibleWrapper>

      <CollapsibleWrapper title="Corners square options" className="grid gap-2">
        <SelectCornerSquare />
        <FormColorTypeChange name="cornersSquareOptions" />
      </CollapsibleWrapper>

      <CollapsibleWrapper title="Corners dot options" className="grid gap-2">
        <SelectCornerDots />
        <FormColorTypeChange name="cornersDotOptions" />
      </CollapsibleWrapper>

      <CollapsibleWrapper title="Background options" className="grid gap-2">
        <FormColorTypeChange name="backgroundOptions" />
      </CollapsibleWrapper>

      <CollapsibleWrapper title="Image options" className="grid gap-2">
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

      <CollapsibleWrapper title="Qr options" className="grid gap-2">
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
      <Label htmlFor="imageLogo">Logo</Label>
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
          Cancel
        </Button>
      </div>
    </>
  );
};

const errorCorrectionLevel = ['L', 'M', 'Q', 'H'] as const;
type ErrorCorrectionLevel = GetTypeOfConst<typeof errorCorrectionLevel>;

const SelectErrorLevel = memo(() => {
  const { register, setValue: sv } = useFormContext<QrFullSchema>();

  const onSelect = useCallback(
    (id: ErrorCorrectionLevel) => {
      sv('qrOptions.errorCorrectionLevel', id);
    },
    [sv]
  );

  useMemo(() => {
    register('qrOptions.errorCorrectionLevel');
  }, [register]);

  return (
    <>
      <Label>Correction Level</Label>
      <SelectWrapper
        placeholder="mode"
        defaultValue={errorCorrectionLevel['2']}
        onSelected={onSelect as OnSelectType}
        name={'qrOptions.errorCorrectionLevel'}
        className="w-full"
      >
        <FormSelectTypeItems type={errorCorrectionLevel} />
      </SelectWrapper>
    </>
  );
});
SelectErrorLevel.displayName = 'SelectErrorLevel';

const qrMode = ['Numeric', 'Alphanumeric', 'Byte', 'Kanji'] as const;
type QrMode = GetTypeOfConst<typeof qrMode>;

const SelectQrMode = memo(() => {
  const { register, setValue: sv } = useFormContext<QrFullSchema>();

  const onSelect = useCallback(
    (id: QrMode) => {
      sv('qrOptions.mode', id);
    },
    [sv]
  );

  useMemo(() => {
    register('qrOptions.mode');
  }, [register]);

  return (
    <>
      <Label>Mode</Label>
      <SelectWrapper
        placeholder="mode"
        defaultValue={qrMode['2']}
        onSelected={onSelect as OnSelectType}
        name={'qrOptions.mode'}
        className="w-full"
      >
        <FormSelectTypeItems type={qrMode} />
      </SelectWrapper>
    </>
  );
});
SelectQrMode.displayName = 'SelectQrMode';

const cornerSquareTypes = ['dot', 'square', 'extra-rounded', 'none'] as const;
type CornerSquareTypes = GetTypeOfConst<typeof cornerSquareTypes>;

const SelectCornerSquare = memo(() => {
  const { register, setValue: sv } = useFormContext<QrFullSchema>();

  const onSelect = useCallback(
    (id: CornerSquareTypes) => {
      const t = id === 'none' ? undefined : id;
      sv('cornersSquareOptions.type', t);
    },
    [sv]
  );

  useMemo(() => {
    register('cornersSquareOptions.type');
  }, [register]);

  return (
    <>
      <Label>Corner square style</Label>
      <SelectWrapper
        placeholder="corner dot style"
        defaultValue={cornerSquareTypes['3']}
        onSelected={onSelect as OnSelectType}
        name={'cornersSquareOptions.type'}
        className="w-full"
      >
        <FormSelectTypeItems type={cornerSquareTypes} />
      </SelectWrapper>
    </>
  );
});
SelectCornerSquare.displayName = 'SelectCornerSquare';

const cornerDotTypes = ['dot', 'square', 'none'] as const;
type CornerDotTypes = GetTypeOfConst<typeof cornerDotTypes>;

const SelectCornerDots = memo(() => {
  const { register, setValue: sv } = useFormContext<QrFullSchema>();

  const onSelect = useCallback(
    (id: CornerDotTypes) => {
      const t = id === 'none' ? undefined : id;
      sv('cornersDotOptions.type', t);
    },
    [sv]
  );

  useMemo(() => {
    register('cornersDotOptions.type');
  }, [register]);

  return (
    <>
      <Label>Corner dot style</Label>
      <SelectWrapper
        placeholder="corner dot style"
        defaultValue={cornerDotTypes['2']}
        onSelected={onSelect as OnSelectType}
        name={'cornersDotOptions.type'}
        className="w-full"
      >
        <FormSelectTypeItems type={cornerDotTypes} />
      </SelectWrapper>
    </>
  );
});
SelectCornerDots.displayName = 'SelectCornerDots';

const FormSelectTypeItems = memo(
  ({ type }: { type: [string, ...string[]] | Readonly<[string, ...string[]]> }) => {
    return (
      <>
        {type.map((d) => (
          <SelectItem key={d} value={d}>
            {d}
          </SelectItem>
        ))}
      </>
    );
  }
);
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
  const { register, setValue: sv } = useFormContext<QrFullSchema>();

  const onSelect = useCallback(
    (id: DotTypes) => {
      sv('dotsOptions.type', id);
    },
    [sv]
  );

  useMemo(() => {
    register('dotsOptions.type');
  }, [register]);

  return (
    <>
      <Label>Dots style</Label>
      <SelectWrapper
        placeholder="dot style"
        defaultValue={dotTypes['4']}
        onSelected={onSelect as OnSelectType}
        name={'dotsOptions.type'}
        className="w-full"
      >
        <FormSelectTypeItems type={dotTypes} />
      </SelectWrapper>
    </>
  );
});
SelectDots.displayName = 'SelectDots';

const FormColorTypeChange = ({ name }: { name: FieldsWithColor }) => {
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
        <Label>Color Type</Label>
        <RadioItem id={`${name}.colorType.single`} value="single" label="Single color" />
        <RadioItem
          id={`${name}.colorType.gradient`}
          value="gradient"
          label="Color gradient"
        />
      </RadioGroup>
      {single ? <FormColorSingle name={name} /> : <FormColorGradient name={name} />}
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
type FieldsWithColor = GetTypeOfConst<typeof fieldsWithColor>;

type GradientType = 'radial' | 'linear';

const FormColorGradient = memo(({ name }: { name: FieldsWithColor }) => {
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
        <Label htmlFor={`${Name}.gradient`}>Gradient type</Label>
        <RadioItem id={`${Name}.gradient.linear`} value="linear" />
        <RadioItem id={`${Name}.gradient.radial`} value="radial" />
      </RadioGroup>
      <Label htmlFor={`${Name}.gradient.rotation`}>Rotation</Label>
      <Input
        id={`${Name}.gradient.rotation`}
        type="number"
        defaultValue={0}
        {...register(`${Name}.gradient.rotation`, { value: 0, valueAsNumber: true })}
      />
      <Label>Colors</Label>
      <div className="flex justify-start">
        <div className="flex space-x-2">
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
          clear
        </Button>
      </div>
    </>
  );
});
FormColorGradient.displayName = 'FormColorGradient';

const FormColorSingle = ({ name }: { name: FieldsWithColor }) => {
  const { register, setValue } = useFormContext<QrFullSchema>();

  const onClickClear = () => {
    setValue(`${name}.color`, undefined);
  };

  return (
    <div className="flex justify-start">
      <span>
        <Label htmlFor={`${name}.color`}>Color</Label>
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
        Clear
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
