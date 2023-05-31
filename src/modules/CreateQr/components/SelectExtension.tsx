import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type FileExtension } from 'qr-code-styling';
import { useState } from 'react';
import { SelectItem, SelectWrapper, type OnSelectType } from '~/components/SelectWrapper';
import { Button } from '~/ui/button';
import { Separator } from '~/ui/separator';

const fileExtensions = ['svg', 'png', 'jpeg', 'webp'] as const;
type SelectExtensionProps = { onDownload: (ext: FileExtension) => void };

const SelectExtension = ({ onDownload }: SelectExtensionProps) => {
  const t = useTranslations('CreateQrPage.DisplayQrCode');
  const [fileExt, setFileExt] = useState<FileExtension>('webp');

  const onClick = () => {
    onDownload(fileExt);
  };
  const onSelected: OnSelectType = (v) => {
    setFileExt(v as FileExtension);
  };

  return (
    <div className="flex items-center rounded-md border bg-secondary text-secondary-foreground">
      <Button
        variant="secondary"
        className="px-3 text-sm tracking-tight"
        onClick={onClick}
      >
        <Download className="mr-2 h-4 w-4" />
        {t('Download')}
      </Button>
      <Separator orientation="vertical" className="h-[20px]" />
      <SelectWrapper
        placeholder="extension"
        onSelected={onSelected}
        defaultValue={fileExt}
        className="w-[75px] border-none"
      >
        {fileExtensions.map((e) => (
          <SelectItem key={e} value={e}>
            {e}
          </SelectItem>
        ))}
      </SelectWrapper>
    </div>
  );
};

export default SelectExtension;
