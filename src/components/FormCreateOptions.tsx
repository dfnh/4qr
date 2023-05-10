import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ChangeEvent,
  useState,
} from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Input } from '~/ui/input';
import { Label } from '~/ui/label';
import { Switch } from '~/ui/switch';
import { Button } from '~/ui/button';
import { CollapsibleWrapper } from './CollapsibleWrapper';
import { RadioGroup, RadioItem } from './RadioItem';
import { SelectItem, SelectWrapper, type OnSelectType } from './SelectWrapper';
import { ErrorSpan } from './ErrorSpan';

import { type QrFullSchema } from '~/schemas/QRCodeStyling';

type GetTypeOfConst<T extends readonly unknown[]> = T[number];

const FormCreateOptions = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<QrFullSchema>();

  return (
    <>
      <CollapsibleWrapper title="Main options" className="grid gap-2" defaultIsOpen>
        <Label htmlFor="width">Width</Label>
        <Input
          id="width"
          placeholder="width"
          type="number"
          {...register('width', { value: 300, valueAsNumber: true })}
        />
        {errors.width?.message && <ErrorSpan>{errors.width.message}</ErrorSpan>}

        <Label htmlFor="height">Height</Label>
        <Input
          id="height"
          placeholder="height"
          type="number"
          {...register('height', { value: 300, valueAsNumber: true })}
        />
        {errors.height?.message && <ErrorSpan>{errors.height.message}</ErrorSpan>}

        <Label htmlFor="margin">Margin</Label>
        <Input
          id="margin"
          placeholder="margin"
          type="number"
          {...register('margin', { value: 0, valueAsNumber: true })}
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
        <Label htmlFor="imageOptions.imageSize">Image size</Label>
        <Input
          id="imageOptions.imageSize"
          placeholder="image size"
          type="number"
          {...register('imageOptions.imageSize', { value: 0.4, valueAsNumber: true })}
        />
        {errors.imageOptions?.imageSize?.message && (
          <ErrorSpan>{errors.imageOptions.imageSize.message}</ErrorSpan>
        )}
        <Label htmlFor="imageOptions.margin">Image margin</Label>
        <Input
          id="imageOptions.margin"
          placeholder="image margin"
          type="number"
          {...register('imageOptions.margin', { value: 0, valueAsNumber: true })}
        />
        {errors.imageOptions?.margin?.message && (
          <ErrorSpan>{errors.imageOptions.margin.message}</ErrorSpan>
        )}
      </CollapsibleWrapper>

      <CollapsibleWrapper title="Qr options" className="grid gap-2">
        <Label htmlFor="qrOptions.typeNumber">Type number</Label>
        <Input
          id="qrOptions.typeNumber"
          placeholder="type number"
          type="number"
          {...register('qrOptions.typeNumber', { value: 0, valueAsNumber: true })}
        />
        {errors.qrOptions?.typeNumber?.message && (
          <ErrorSpan>{errors.qrOptions.typeNumber.message}</ErrorSpan>
        )}

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
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="imageLogo">Logo</Label>
      <span className="flex w-full items-center space-x-2">
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
      </span>
    </div>
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
    <div className="flex items-center space-x-2">
      <Label>Mode</Label>
      <SelectWrapper
        placeholder="mode"
        defaultValue={errorCorrectionLevel['2']}
        onSelected={onSelect as OnSelectType}
        name={'qrOptions.errorCorrectionLevel'}
        // {...register('qrOptions.errorCorrectionLevel')}
      >
        <FormSelectTypeItems type={errorCorrectionLevel} />
      </SelectWrapper>
    </div>
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
    <div className="flex items-center space-x-2">
      <Label>Mode</Label>
      <SelectWrapper
        placeholder="mode"
        defaultValue={qrMode['2']}
        onSelected={onSelect as OnSelectType}
        name={'qrOptions.mode'}
        // {...register('qrOptions.mode')}
      >
        <FormSelectTypeItems type={qrMode} />
      </SelectWrapper>
    </div>
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
    <div className="flex items-center space-x-2">
      <Label>Corner square style</Label>
      <SelectWrapper
        placeholder="corner dot style"
        defaultValue={cornerSquareTypes['3']}
        onSelected={onSelect as OnSelectType}
        name={'cornersSquareOptions.type'}
        // {...register('cornersSquareOptions.type')}
      >
        <FormSelectTypeItems type={cornerSquareTypes} />
      </SelectWrapper>
    </div>
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
    <div className="flex items-center space-x-2">
      <Label>Corner dot style</Label>
      <SelectWrapper
        placeholder="corner dot style"
        defaultValue={cornerDotTypes['2']}
        onSelected={onSelect as OnSelectType}
        name={'cornersDotOptions.type'}
        // {...register('cornersDotOptions.type')}
      >
        <FormSelectTypeItems type={cornerDotTypes} />
      </SelectWrapper>
    </div>
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
    <div className="flex items-center space-x-2">
      <Label>Dots style</Label>
      <SelectWrapper
        placeholder="dot style"
        defaultValue={dotTypes['4']}
        onSelected={onSelect as OnSelectType}
        name={'dotsOptions.type'}
        // {...register('dotsOptions.type')}
      >
        <FormSelectTypeItems type={dotTypes} />
      </SelectWrapper>
    </div>
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
        className="mb-2 flex space-x-2"
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

const fieldsWithColor = [
  'dotsOptions',
  'cornersDotOptions',
  'cornersSquareOptions',
  'backgroundOptions',
] as const;
type FieldsWithColor = GetTypeOfConst<typeof fieldsWithColor>;

type GradientType = 'radial' | 'linear';

const FormColorGradient = ({ name }: { name: FieldsWithColor }) => {
  const { register, setValue, resetField } = useFormContext<QrFullSchema>();

  const Name = useMemo(() => name, [name]);

  useEffect(() => {
    register(`${Name}.gradient.type`, { value: 'linear' });
  }, [Name, register]);

  const onValueChange = (value: GradientType) => {
    setValue(`${Name}.gradient.type`, value);
  };

  const onClickClear = () => {
    resetField(`${Name}.gradient.colorStops.0.color`);
    resetField(`${Name}.gradient.colorStops.1.color`);
  };

  return (
    <>
      <RadioGroup
        id={`${Name}.gradient.type`}
        defaultValue="linear"
        onValueChange={onValueChange}
        className="flex space-x-2"
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
      <div className="flex justify-start">
        <span className="flex space-x-2">
          <Input
            id={`${Name}.color`}
            type="color"
            className="w-24"
            {...register(`${Name}.gradient.colorStops.0.color`)}
          />
          <Input
            id={`${Name}.color`}
            type="color"
            className="w-24"
            {...register(`${Name}.gradient.colorStops.1.color`)}
          />
        </span>
        <Button type="button" className="ml-auto" onClick={onClickClear}>
          clear
        </Button>
      </div>
    </>
  );
};

const FormColorSingle = ({ name }: { name: FieldsWithColor }) => {
  const { register, setValue } = useFormContext<QrFullSchema>();

  const onClickClear = () => {
    setValue(`${name}.color`, undefined);
  };

  return (
    <>
      <div className="flex justify-start">
        <span>
          <Label htmlFor={`${name}.color`}>Color</Label>
          <Input
            id={`${name}.color`}
            type="color"
            className="w-24"
            {...register(`${name}.color`)}
          />
        </span>
        <Button type="button" className="ml-auto self-end" onClick={onClickClear}>
          Clear
        </Button>
      </div>
    </>
  );
};

export const FormSwitch = ({ name, label }: { name: string; label: string }) => {
  const { control } = useFormContext();
  return (
    <div className="flex items-center space-x-2">
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, ref } }) => (
          <Switch id={name} ref={ref} onCheckedChange={(v) => onChange(v)} />
        )}
      />
      <Label htmlFor={name}>{label}</Label>
    </div>
  );
}; // FormSwitch.displayName = 'FormSwitch';

export { FormCreateOptions };
