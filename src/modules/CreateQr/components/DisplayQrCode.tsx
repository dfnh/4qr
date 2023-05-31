import { useAtomValue } from 'jotai';
import { type FileExtension } from 'qr-code-styling';
import { useEffect, useRef } from 'react';
import { useToast } from '~/hooks/useToast';
import { da } from '~/store/atoms';
import { qrCodeAtom } from '~/store/qrAtom';
import DisplayKeys from './DisplayKeys';
import SelectExtension from './SelectExtension';

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

export default DisplayQrCode;
