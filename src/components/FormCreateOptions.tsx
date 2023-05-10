import { memo, useCallback, useEffect, useMemo, useRef, type ChangeEvent } from 'react';
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
        <Label htmlFor="dotsOptions.color">Color type</Label>
        <Input
          id="dotsOptions.color"
          type="color"
          className="w-28"
          {...register('dotsOptions.color')}
        />
      </CollapsibleWrapper>

      <CollapsibleWrapper title="Corners square options" className="grid gap-2">
        <SelectCornerSquare />
        <Label htmlFor="cornersSquareOptions.color">Color type</Label>
        <Input
          id="cornersSquareOptions.color"
          type="color"
          className="w-28"
          {...register('cornersSquareOptions.color')}
        />
      </CollapsibleWrapper>

      <CollapsibleWrapper title="Corners dot options" className="grid gap-2">
        <SelectCornerDots />
        <Label htmlFor="cornersDotOptions.color">Color type</Label>
        <Input
          id="cornersDotOptions.color"
          type="color"
          className="w-28"
          {...register('cornersDotOptions.color')}
        />
      </CollapsibleWrapper>

      <CollapsibleWrapper title="Background options" className="grid gap-2">
        <Label htmlFor="backgroundOptions.color">Color type</Label>
        <Input
          id="backgroundOptions.color"
          type="color"
          className="w-28"
          {...register('backgroundOptions.color', { value: '#ffffff' })}
        />
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

const FormGradient = ({ name }: { name: string }) => {
  const { register } = useFormContext();
  return (
    <>
      <Label htmlFor={`${name}.gradient`}>Gradient type</Label>
      <RadioGroup
        id={`${name}.gradient`}
        defaultValue="linear"
        {...register(`${name}.gradient`)}
      >
        <RadioItem id={`${name}.gradient.linear`} value="linear" />
        <RadioItem id={`${name}.gradient.radial`} value="radial" />
      </RadioGroup>
      <Label htmlFor={`${name}.gradient.rotation`}>Rotation</Label>
      <Input
        id={`${name}.gradient.rotation`}
        type="number"
        {...register(`${name}.gradient.rotation`, { valueAsNumber: true })}
      />
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
