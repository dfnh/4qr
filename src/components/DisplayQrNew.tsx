import { useAtomValue } from 'jotai';
import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type FileExtension } from 'qr-code-styling';
import { useEffect, useRef, useState } from 'react';
import { Info } from '~/components/icons';
import { copyToClipboard } from '~/helpers/copyToClipboard';
import { exportJson } from '~/helpers/exportJson';
import { useToast } from '~/hooks/useToast';
import { da } from '~/store/atoms';
import { useKeysAtomValue, useSlinkNewAtomValue } from '~/store/hooks';
import { qrCodeAtom } from '~/store/qrAtom';
import { Button } from '~/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/ui/card';
import { Label } from '~/ui/label';
import { Separator } from '~/ui/separator';
import { CopyButton } from './CopyButton';
import HoverCardWrapper from './HoverCardWrapper';
import { SelectItem, SelectWrapper, type OnSelectType } from './SelectWrapper';

const DisplayQrCode = () => {
  const qrCode = useAtomValue(qrCodeAtom);
  const { toast } = useToast();
  const daAtom = useAtomValue(da);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      qrCode.append(ref.current);
    }
  }, [qrCode]);

  useEffect(() => {
    if (!qrCode) return;
    try {
      qrCode.update(daAtom);
      // console.log(daAtom);
    } catch (err) {
      console.log(err as string);
      toast({
        title: 'Error',
        description: (err as string | undefined) ?? 'something went wrong',
        variant: 'destructive',
      });
    }
  }, [daAtom, qrCode, toast]);

  const onDownloadClick = (ext: FileExtension) => {
    if (!qrCode) return;
    qrCode.download({ extension: ext, name: `qrcode` }).catch((error) => {
      console.error(error);
    });
  };

  return (
    <>
      <div className="">
        <div className="h-fit max-h-full w-fit max-w-full">
          <div
            className="box-border block [&>canvas]:!max-h-[300px] [&>canvas]:!w-full [&>canvas]:!max-w-[300px] [&>svg]:!max-h-[300px] [&>svg]:!max-w-[300px]"
            ref={ref}
          />
        </div>
      </div>
      <SelectExtension onDownload={onDownloadClick} />
      <DisplayKeys />
    </>
  );
};

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
    <>
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
    </>
  );
};

const DisplayQrNew = () => {
  const t = useTranslations('CreateQrPage.DisplayQrCode');

  return (
    <Card className="top-0 border-ring bg-slate-500/5 text-foreground dark:bg-foreground/5 md:sticky">
      <CardHeader>
        <CardTitle>{t('Your qr code')}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center px-2">
        <div className="flex flex-col items-center gap-2">
          <DisplayQrCode />
        </div>
      </CardContent>
    </Card>
  );
};

const DisplayKeys = () => {
  const t = useTranslations('CreateQrPage.DisplayQrCode.DisplayKeys');
  const keysAtom = useKeysAtomValue();
  const slink = useSlinkNewAtomValue();

  if (!keysAtom?.privateKey || !keysAtom.publicKey || !slink.trim()) {
    return null;
  }

  const handleCopy = (value: string) => {
    return () => {
      copyToClipboard(value);
    };
  };

  return (
    <>
      <Card className="w-full border-inherit bg-inherit text-inherit ">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            {t('Your keys')}
            <HoverCardWrapper
              className="text-sm"
              openDelay={300}
              hoverCardText={t('displayKeysHoverCardText')}
            >
              <Info />
            </HoverCardWrapper>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-2 px-2">
          <div className="flex items-center gap-2">
            <Label>{t('Public key')}: </Label>
            <Label>***</Label>
            <CopyButton onClick={handleCopy(keysAtom.publicKey)} />
          </div>
          <div className="flex items-center gap-2">
            <Label>{t('Private key')}: </Label>
            <Label>***</Label>
            <CopyButton onClick={handleCopy(keysAtom.privateKey)} />
          </div>
          <a
            type="button"
            href={exportJson(keysAtom)}
            download={`key-pair-${slink}.json`}
            className="hover:animate-hue-rotation hover:text-emerald-500 dark:hover:text-emerald-200"
          >
            {t('Download Json')}
          </a>
        </CardContent>
      </Card>
    </>
  );
};

export default DisplayQrNew;
