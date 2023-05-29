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
    </>
  );
};

export default ScanCam;
