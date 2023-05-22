import Image from 'next/image';
import { memo, useEffect, useRef, useState, type DragEvent } from 'react';
import { type ValueOf } from '~/typescript';
import { type InputProps } from '~/ui/input';

type OnChange = ValueOf<Pick<InputProps, 'onChange'>>;
export type DragAndDropProps = { onSuccess?: (file: File) => void };

const DragAndDrop = memo(({ onSuccess }: DragAndDropProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [image, setImage] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = [...e.dataTransfer.files];
    const file = droppedFiles.find((e) => e.type.startsWith('image/'));

    if (!file) return;
    setImage(URL.createObjectURL(file));
    onSuccess?.(file);
  };

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
      <div className="flex h-44 max-h-80 w-full cursor-pointer appearance-none flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-4 transition hover:border-gray-400 focus:outline-none">
        <div
          className="flex h-full w-full flex-col"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="pointer-events-none flex h-full w-full select-none flex-col items-center justify-center">
            <p className="text-sm text-muted-foreground">
              {isDragging ? 'Drop the image file here' : 'Drag and drop image file here'}
            </p>
            <p className="text-sm text-muted-foreground">or click to select</p>
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
