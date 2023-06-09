import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { memo, useEffect, useRef, useState } from 'react';
import { type ValueOf } from '~/typescript';
import { type InputProps } from '~/ui/input';
import { withPreventDefault } from '../helpers/withPreventDefault';

type OnChange = ValueOf<Pick<InputProps, 'onChange'>>;
type DragAndDropProps = { onSuccess?: (file: File) => void };

const DragAndDrop = memo(({ onSuccess }: DragAndDropProps) => {
  const t = useTranslations('ScanPage.DragAndDrop');
  const [isDragging, setIsDragging] = useState(false);
  const [image, setImage] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = withPreventDefault(() => {
    setIsDragging(true);
  });

  const handleDragLeave = withPreventDefault(() => {
    setIsDragging(false);
  });

  const handleDragOver = withPreventDefault(() => {
    return;
  });

  const handleDrop = withPreventDefault((e) => {
    setIsDragging(false);

    const droppedFiles = [...e.dataTransfer.files];
    const file = droppedFiles.find((e) => e.type.startsWith('image/'));

    if (!file) return;
    setImage(URL.createObjectURL(file));
    onSuccess?.(file);

    if (!inputRef.current) return;
    const dt = new DataTransfer();
    dt.items.add(file);
    inputRef.current.files = dt.files;
  });

  const handleDivClick = () => {
    inputRef.current?.click();
  };

  const handleChange: OnChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));
    onSuccess?.(file);
  };

  useEffect(() => {
    const handlePaste = (ev: globalThis.ClipboardEvent) => {
      if (!ev.clipboardData?.files) return;
      const files = Array.from(ev.clipboardData.files);
      const file = files.find((file) => file.type.startsWith('image/'));
      if (!file) return;
      setImage(URL.createObjectURL(file));
      onSuccess?.(file);
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [onSuccess]);

  return (
    <div onClick={handleDivClick}>
      <input ref={inputRef} hidden type="file" accept="image/*" onChange={handleChange} />
      <div className="flex h-44 max-h-80 w-full cursor-pointer appearance-none flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-0 transition hover:border-gray-400 focus:outline-none">
        <div
          className="flex h-full w-full flex-col"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="pointer-events-none flex h-full w-full select-none flex-col items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">
              {isDragging ? t('isDragging') : t('isNotDragging')}
            </p>
            <p className="text-sm text-muted-foreground">{t('or click to select')}</p>
            {image && (
              <Image
                className="mt-2 h-20 w-fit"
                src={image}
                alt="Users image"
                width={64}
                height={64}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
DragAndDrop.displayName = 'DragAndDrop';

export default DragAndDrop;
