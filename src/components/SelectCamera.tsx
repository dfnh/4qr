import type QrScanner from 'qr-scanner';
import { memo } from 'react';
import { SelectItem, SelectWrapper } from './SelectWrapper';

export type SelectCameraProps = {
  cameras: QrScanner.Camera[];
  onSelected: (id: string) => void;
  placeholder?: string;
};

const SelectCamera = memo(({ cameras, placeholder, onSelected }: SelectCameraProps) => {
  return (
    <SelectWrapper
      placeholder={placeholder || 'Select Camera'}
      disabled={cameras.length === 0}
      onSelected={onSelected}
      className="w-72 max-w-md"
    >
      {cameras.length !== 0 &&
        cameras.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.label}
          </SelectItem>
        ))}
    </SelectWrapper>
  );
});
SelectCamera.displayName = 'SelectCamera';

export { SelectCamera };
