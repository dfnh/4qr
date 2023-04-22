import { useCallback } from 'react';
import { useCameraList } from '~/hooks/useCameraList';
import { useQrScanner } from '~/hooks/useQrScanner';
import { Camera } from '~/components/Camera';
import { Button } from '~/ui/button';
import { SelectCamera } from './SelectCamera';

// todo decompose
const WebCam = () => {
  const { cameras, refresh } = useCameraList();
  const { result: data, start, stop, camRef, active, changeCam } = useQrScanner();

  const toggle = () => {
    if (active) {
      stop();
      return;
    }
    start();
  };

  const checkCamFn = useCallback(() => void refresh(), [refresh]);

  return (
    <>
      <div className="container flex flex-col items-center justify-center gap-10 px-8 py-8 ">
        <h1 className="text-5xl font-bold tracking-tight text-white ">using web cam</h1>
        {cameras.length === 0 ? (
          <Button variant="default" onClick={checkCamFn}>
            check cameras
          </Button>
        ) : (
          <Button variant={active ? 'destructive' : 'start'} onClick={toggle}>
            {active ? 'stop' : 'start'}
          </Button>
        )}
        <SelectCamera
          cameras={cameras}
          onSelected={(e) => {
            changeCam(e);
          }}
        />

        <Camera ref={camRef} />

        <div className="text- text-base text-gray-50">{data}</div>
      </div>
    </>
  );
};

export { WebCam };
