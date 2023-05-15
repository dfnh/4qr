import { useAtom, useAtomValue } from 'jotai';
import React, { useEffect, useRef, useState } from 'react';
import { da } from '~/store/atoms';

import { type FileExtension } from 'qr-code-styling';
import { copyToClipboard } from '~/helpers/copyToClipboard';
import { exportJson } from '~/helpers/exportJson';
import { useToast } from '~/hooks/useToast';
import { useKeysAtomValue, useSlinkNewAtomValue } from '~/store/hooks';
import { qrCodeAtom } from '~/store/qrAtom';
import { Card, CardContent, CardHeader, CardTitle } from '~/ui/card';
import { Label } from '~/ui/label';
import HoverCardWrapper from './HoverCardWrapper';
import { Info } from '~/components/icons';
import { CopyButton } from './CopyButton';

import { Button } from '~/ui/button';

import { Separator } from '~/ui/separator';
import { Download } from 'lucide-react';
import { type OnSelectType, SelectItem, SelectWrapper } from './SelectWrapper';

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
      <div>
        <SelectExtension onDownload={onDownloadClick} />
      </div>

      <DisplayKeys />
    </>
  );
};

const fileExtensions = ['svg', 'png', 'jpeg', 'webp'] as const;
type SelectExtensionProps = { onDownload: (ext: FileExtension) => void };

const SelectExtension = ({ onDownload }: SelectExtensionProps) => {
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
        <Button variant="secondary" className="px-3" onClick={onClick}>
          <Download className="mr-2 h-4 w-4" />
          Download
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
  return (
    <Card className="top-0 border-ring bg-slate-500/5 text-foreground dark:bg-foreground/5 md:sticky">
      <CardHeader>
        <CardTitle>Your qr code</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center px-2">
        <div className="flex flex-col items-center gap-2">
          <DisplayQrCode />
        </div>
      </CardContent>
    </Card>
  );
};

const displayKeysHoverCardText = `
These keys are your public and private keys, they are like your secret code that only you should know.
Your private key is used to sign the data that you inputted into the QR code. This means that the data is secure and can only be verified by someone who has the corresponding public key. If someone tries to tamper with the data or create a fake QR code, the signature will not match, and it will be clear that the data has been modified
`;

const DisplayKeys = () => {
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
            Your keys
            <HoverCardWrapper
              className="text-sm"
              openDelay={300}
              hoverCardText={displayKeysHoverCardText}
            >
              <Info />
            </HoverCardWrapper>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-2 px-2">
          <div className="flex items-center gap-2">
            <Label>Public key: </Label>
            <Label>***</Label>
            <CopyButton onClick={handleCopy(keysAtom.publicKey)} />
          </div>
          <div className="flex items-center gap-2">
            <Label>Private key: </Label>
            <Label>***</Label>
            <CopyButton onClick={handleCopy(keysAtom.privateKey)} />
          </div>
          <a
            type="button"
            href={exportJson(keysAtom)}
            download={`key-pair-${slink}.json`}
            className="hover:animate-hue-rotation hover:text-emerald-500 dark:hover:text-emerald-200"
          >
            Download Json
          </a>
        </CardContent>
      </Card>
    </>
  );
};

export default DisplayQrNew;
