import { memo } from 'react';
import { type UseFormRegisterReturn } from 'react-hook-form';
import { Input, type InputProps } from '~/ui/input';
import { Label } from '~/ui/label';
import { ErrorSpan } from './ErrorSpan';

export type InputWithLabelProps = {
  id: string;
  labelText: string;
  error?: string;
  register?: Partial<UseFormRegisterReturn>;
} & InputProps;

const InputWithLabel = memo(
  ({ id, labelText, error, register, ...rest }: InputWithLabelProps) => {
    return (
      <div className="grid w-full gap-1.5">
        <Label htmlFor={id}>{labelText}</Label>
        <Input id={id} {...register} {...rest} />
        {error && <ErrorSpan>{error}</ErrorSpan>}
      </div>
    );
  }
);
InputWithLabel.displayName = 'InputWithLabel';

export default InputWithLabel;
