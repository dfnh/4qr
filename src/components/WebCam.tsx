import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { Camera } from '~/components/Camera';
import { useCameraList } from '~/hooks/useCameraList';
import { useQrScanner } from '~/hooks/useQrScanner';
import { useToast } from '~/hooks/useToast';
import { Button } from '~/ui/button';
import { SelectCamera } from './SelectCamera';

const WebCam = () => {
  const t = useTranslations('CamPage');
  const { cameras, refresh } = useCameraList();
  const { result: data, toggle, camRef, active, changeCam } = useQrScanner();
  const { toast } = useToast();

  const checkCamFn = useCallback(() => {
    refresh().catch((e) => {
      console.error(e);
      toast({
        variant: 'destructive',
        title: t('toast.no webcam.title'),
        description: t('toast.no webcam.description'),
      });
    });
  }, [refresh, t, toast]);

  const onSelected = useCallback(
    (id: string) => {
      changeCam(id);
    },
    [changeCam]
  );

  return (
    <>
      <div className="container flex flex-col items-center justify-center gap-10 pb-4 ">
        <h1 className="text-center text-2xl font-bold tracking-tight md:text-4xl">
          {t('title')}
        </h1>
        <WebCamButtons
          cameras={cameras}
          active={active}
          toggle={toggle}
          checkCamFn={checkCamFn}
        />
        <SelectCamera
          placeholder={t('SelectCamera')}
          cameras={cameras}
          onSelected={onSelected}
        />
        <Camera ref={camRef} />
        <div className="text-base">{data}</div>
      </div>
    </>
  );
};

import type QrScanner from 'qr-scanner';

type WebCamButtonsProps = {
  cameras: QrScanner.Camera[];
  checkCamFn: () => void;
  active: boolean;
  toggle: () => void;
};
const WebCamButtons = ({ cameras, checkCamFn, active, toggle }: WebCamButtonsProps) => {
  const t = useTranslations('CamPage.WebCamButtons');

  if (cameras.length === 0) {
    return (
      <Button variant="default" onClick={checkCamFn}>
        {t('give access')}
      </Button>
    );
  }

  return (
    <Button variant={active ? 'destructive' : 'start'} className="w-20" onClick={toggle}>
      {active ? t('active.stop') : t('active.start')}
    </Button>
  );
};

export default WebCam;
