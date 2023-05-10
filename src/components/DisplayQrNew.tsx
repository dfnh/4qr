import { useAtom, useAtomValue } from 'jotai';
import React, { type ChangeEvent } from 'react';
import { da } from '~/store/atoms';
import { useEffect, useRef, useState } from 'react';

import QRCodeStyling, { type FileExtension, type Options } from 'qr-code-styling';
import { Card, CardContent, CardHeader, CardTitle } from '~/ui/card';
import { qrCodeAtom } from '~/store/qrAtom';

const DisplayQrCode = () => {
  const [fileExt, setFileExt] = useState<FileExtension>('svg');
  const daAtom = useAtomValue(da);
  const [qrCode, setQrCode] = useAtom(qrCodeAtom);

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
    }
  }, [daAtom, qrCode]);

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

export default DisplayQrNew;
