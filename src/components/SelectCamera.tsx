import { memo, useCallback, useState } from 'react';
import type QrScanner from 'qr-scanner';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/ui/select';

const SelectCamera = memo(
  ({
    cameras,
    onSelected,
    disabled = false,
  }: {
    cameras: QrScanner.Camera[];
    onSelected: (id: string) => void;
    disabled?: boolean;
  }) => {
    const [value, setValue] = useState<string>();
    const handleValueChange = useCallback(
      (v: string) => {
        setValue(v);
        onSelected(v);
      },
      [onSelected]
    );
    return (
      <Select
        value={value}
        onValueChange={handleValueChange}
        disabled={disabled || cameras.length === 0}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a camera"></SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {cameras.length !== 0 &&
              cameras.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.label}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }
);
SelectCamera.displayName = 'SelectCamera';

export { SelectCamera };
