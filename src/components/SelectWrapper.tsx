import { type SelectProps } from '@radix-ui/react-select';
import { memo, useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from '~/ui/select';
import { cn } from '~/utils/cn';

export type SelectWrapperProps = {
  placeholder: string;
  onSelected: OnSelectType;
  className?: string;
  disabled?: boolean;
} & SelectProps;

//fixme im braindead
export type OnSelectType = (value: string) => void;

const SelectWrapper = memo(
  ({
    children,
    placeholder,
    onSelected,
    defaultValue,
    className,
    disabled = false,
    ...props
  }: SelectWrapperProps) => {
    const handleValueChange = useCallback(
      (v: string) => {
        onSelected(v);
      },
      [onSelected]
    );

    return (
      <Select
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        disabled={disabled}
        {...props}
      >
        <SelectTrigger className={cn('w-[180px]', className)}>
          <SelectValue placeholder={placeholder}></SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>{children}</SelectGroup>
        </SelectContent>
      </Select>
    );
  }
);
SelectWrapper.displayName = 'SelectWrapper';

export { SelectWrapper, SelectItem, SelectLabel };
