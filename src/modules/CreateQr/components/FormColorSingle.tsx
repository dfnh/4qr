import { Button, Input, Label } from '~/ui';
import { useFormContextQr } from '../helpers/useFormContextQr';
import { type FieldsWithColor } from '../types/FieldsWithColor';

type FormColorSingleProps = {
  name: FieldsWithColor;
  label: string;
  clear: string;
};

const defaultFieldColor = new Map<FieldsWithColor, string>([
  ['backgroundOptions', '#ffffff'],
]);

const FormColorSingle = ({ name, label, clear }: FormColorSingleProps) => {
  const { register, setValue } = useFormContextQr();
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

export default FormColorSingle;
