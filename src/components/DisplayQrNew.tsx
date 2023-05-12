import { useAtom, useAtomValue } from 'jotai';
import React, { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { da } from '~/store/atoms';

import { Copy } from 'lucide-react';
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

const DisplayQrCode = () => {
  const [fileExt, setFileExt] = useState<FileExtension>('svg');
  const [qrCode, setQrCode] = useAtom(qrCodeAtom);
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
      console.log(daAtom);
    } catch (err) {
      console.log(err as string);
      toast({
        title: 'Error',
        description: (err as string | undefined) ?? 'something went wrong',
        variant: 'destructive',
      });
    }
  }, [daAtom, qrCode, toast]);

  const onExtensionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFileExt(event.target.value as FileExtension);
  };

  const onDownloadClick = () => {
    if (!qrCode) return;
    qrCode
      .download({
        extension: fileExt,
      })
      .catch((error) => {
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
        <select onChange={onExtensionChange} value={fileExt}>
          <option value="svg">SVG</option>
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
          <option value="webp">WEBP</option>
        </select>
        <button onClick={onDownloadClick}>Download</button>
      </div>

      <DisplayKeys />
    </>
  );
};

const SelectExtension = () => {
  return <></>;
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
