import type QrScanner from 'qr-scanner';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/ui/select';

const SelectCamera = ({
  cameras,
  onSelected,
  disabled = false,
}: {
  cameras: QrScanner.Camera[];
  onSelected: (id: string) => void;
  disabled?: boolean;
}) => {
  const [value, setValue] = useState<string>();
  const handleValueChange = (v: string) => {
    setValue(v);
    onSelected(v);
  };
  return (
    <Select value={value} onValueChange={handleValueChange} disabled={disabled}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a camera"></SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {/* <SelectLabel>webcams</SelectLabel> */}
          {/* <SelectItem value="apple">Apple</SelectItem> */}
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
};
export { SelectCamera };
