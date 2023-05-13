import { type RadioGroupItemProps } from '@radix-ui/react-radio-group';
import { Label } from '~/ui/label';
import { RadioGroup, RadioGroupItem } from '~/ui/radiogroup';

export type RadioItemProps = { id: string; label?: string } & RadioGroupItemProps;

const RadioItem = ({ id, value, label }: RadioItemProps) => {
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={value} id={id} />
      <Label htmlFor={id}>{label ?? value}</Label>
    </div>
  );
};

export { RadioItem, RadioGroup };
