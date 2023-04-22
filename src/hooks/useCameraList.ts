import QrScanner from 'qr-scanner';
import { useCallback, useEffect, useState } from 'react';

const useCameraList = () => {
  const [cameras, setCameras] = useState<QrScanner.Camera[]>([]);

  const refresh = useCallback(async () => {
    const devices = await QrScanner.listCameras(false);
    const cams = devices.filter((d) => d.id != '');
    setCameras(cams);
  }, []);

  const askPerms = useCallback(async () => {
    const devices = await QrScanner.listCameras(true);
    const cams = devices.filter((d) => d.id != '');
    setCameras(cams);
  }, []);

  useEffect(() => {
    refresh().catch((e) => console.error(e));
    // console.log('yo');
  }, [refresh]);

  return { cameras: cameras, refresh: askPerms };
};

export { useCameraList };
