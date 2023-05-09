import type QrScanner from 'qr-scanner';
import { memo } from 'react';
import { SelectItem } from '~/ui/select';
import { SelectWrapper } from './SelectWrapper';

const SelectCamera = memo(
  ({
    cameras,
    onSelected,
  }: {
    cameras: QrScanner.Camera[];
    onSelected: (id: string) => void;
  }) => {
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
  }
);
SelectCamera.displayName = 'SelectCamera';

export { SelectCamera };
