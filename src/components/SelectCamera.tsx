import type QrScanner from 'qr-scanner';
import { memo } from 'react';
import { SelectItem, SelectWrapper } from './SelectWrapper';

export type SelectCameraProps = {
  cameras: QrScanner.Camera[];
  onSelected: (id: string) => void;
};

const SelectCamera = memo(({ cameras, onSelected }: SelectCameraProps) => {
  return (
    <SelectWrapper
      placeholder="Select camera"
      disabled={cameras.length === 0}
      onSelected={onSelected}
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
