import { Controller, useFormContext } from 'react-hook-form';
import { Label } from '~/ui/label';
import { Switch } from '~/ui/switch';

export type FormSwitchProps = {
  name: string;
  label: string;
  disabled?: boolean;
};

const FormSwitch = ({ name, label, disabled = false }: FormSwitchProps) => {
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
};

export default FormSwitch;
