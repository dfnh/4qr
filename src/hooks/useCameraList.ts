import QrScanner from 'qr-scanner';
import { useCallback, useEffect, useState } from 'react';

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
    // console.log('yo');
  }, [refresh]);

  return { cameras: cameras, refresh: askPerms };
};

const getListCameras = async (perms = false) => {
  const devices = await QrScanner.listCameras(perms);
  const cams = devices.filter((d) => d.id != '');
  return cams;
};

export { useCameraList };
