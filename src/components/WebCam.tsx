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
      <div className="container flex flex-col items-center justify-center gap-10 pb-8 ">
        <h1 className="text-5xl font-bold tracking-tight text-white ">using web cam</h1>
        <WebCamButtons
          cameras={cameras}
          active={active}
          toggle={toggle}
          checkCamFn={checkCamFn}
        />

        <SelectCamera cameras={cameras} onSelected={onSelected} />

        <Camera ref={camRef} />

        <div className="text-base text-gray-50">{data}</div>
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
  return (
    <>
      {cameras.length === 0 ? (
        <Button variant="default" onClick={checkCamFn}>
          check cameras
        </Button>
      ) : (
        <Button variant={active ? 'destructive' : 'start'} onClick={toggle}>
          {active ? 'stop' : 'start'}
        </Button>
      )}
    </>
  );
};
// WebCamButtons.displayName = 'WebCamButtons';

export { WebCam };
