import { type SelectProps } from '@radix-ui/react-select';
import { memo, useCallback, type ReactNode } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '~/ui/select';

export type SelectWrapperProps = {
  children: ReactNode;
  placeholder: string;
  onSelected: OnSelectType;
  disabled?: boolean;
  defaultValue?: string;
} & SelectProps;

//fixme im braindead
export type OnSelectType = (id: string) => void;

const SelectWrapper = memo(
  ({
    children,
    placeholder,
    onSelected,
    defaultValue,
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
        <SelectTrigger className="w-[180px]">
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

export { SelectWrapper, SelectItem };
