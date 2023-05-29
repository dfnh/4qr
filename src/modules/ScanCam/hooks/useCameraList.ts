import type QrScanner from 'qr-scanner';
import { useCallback, useEffect, useState } from 'react';
import { getListCameras } from '../helpers/getListCameras';

const useCameraList = () => {
  const [cameras, setCameras] = useState<QrScanner.Camera[]>([]);

  const refresh = useCallback(async () => {
    const cams = await getListCameras();
    setCameras(cams);
  }, []);

  const askPerms = useCallback(async () => {
    const cams = await getListCameras(true);
    setCameras(cams);
    if (cams.length === 0) {
      throw new Error('no webcams');
    }
  }, []);

  useEffect(() => {
    refresh().catch((e) => console.error(e));
  }, [refresh]);

  return { cameras: cameras, refresh: askPerms };
};

export { useCameraList };
