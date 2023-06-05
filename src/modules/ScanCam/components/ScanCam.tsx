import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { useToast } from '~/hooks/useToast';
import { useCameraList, useQrScanner } from '../hooks';
import Camera from './Camera';
import SelectCamera from './SelectCamera';
import WebCamButtons from './WebCamButtons';

const ScanCam = () => {
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
      <div className="flex flex-col items-center gap-3">
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
      </div>
      <Camera ref={camRef} />
      <p className="select-all break-all text-center text-base">{data}</p>
    </>
  );
};

export default ScanCam;
