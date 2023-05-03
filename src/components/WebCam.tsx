import { useCallback } from 'react';
import { useCameraList } from '~/hooks/useCameraList';
import { useQrScanner } from '~/hooks/useQrScanner';
import { Camera } from '~/components/Camera';
import { Button } from '~/ui/button';
import { SelectCamera } from './SelectCamera';

// todo decompose
const WebCam = () => {
  const { cameras, refresh } = useCameraList();
  const { result: data, toggle, camRef, active, changeCam } = useQrScanner();

  const checkCamFn = useCallback(() => void refresh(), [refresh]);
  const onSelected = useCallback(
    (id: string) => {
      changeCam(id);
    },
    [changeCam]
  );

  return (
    <>
      <div className="container flex flex-col items-center justify-center gap-10 pb-4 ">
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
          scan with webcam
        </h1>
        <WebCamButtons
          cameras={cameras}
          active={active}
          toggle={toggle}
          checkCamFn={checkCamFn}
        />

        <SelectCamera cameras={cameras} onSelected={onSelected} />

        <Camera ref={camRef} />

        <div className="text-base">{data}</div>
      </div>
    </>
  );
};

import type QrScanner from 'qr-scanner';

const WebCamButtons = ({
  cameras,
  checkCamFn,
  active,
  toggle,
}: {
  cameras: QrScanner.Camera[];
  checkCamFn: () => undefined;
  active: boolean;
  toggle: () => void;
}) => {
  if (cameras.length === 0) {
    return (
      <Button variant="default" onClick={checkCamFn}>
        check cameras
      </Button>
    );
  }

  return (
    <Button variant={active ? 'destructive' : 'start'} onClick={toggle}>
      {active ? 'stop' : 'start'}
    </Button>
  );
};

export { WebCam };
