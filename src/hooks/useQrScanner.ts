import { useCallback, useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';

const useQrScanner = () => {
  const [scanner, setScanner] = useState<QrScanner | null>(null);
  const [scannedData, setScannedData] = useState<string>('initial data');
  const [active, setActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [deviceId, setDeviceId] = useState<string>();

  useEffect(() => {
    if (videoRef.current == null) return;

    const newScanner = new QrScanner(
      videoRef.current,
      (result) => {
        newScanner.stop();
        setActive(false);
        setScannedData(result.data);
      },
      { returnDetailedScanResult: true }
    );
    setScanner(newScanner);

    return () => {
      console.log('bb');
      newScanner.destroy();
    };
  }, []);

  const restartScanner = () => {
    if (videoRef.current == null) return;

    scanner?.destroy();
    setActive(false);

    const newScanner = new QrScanner(
      videoRef.current,
      (result) => {
        newScanner.stop();
        setActive(false);
        setScannedData(result.data);
      },
      { returnDetailedScanResult: true }
    );
    setScanner(newScanner);
  };

  const start = useCallback(() => {
    if (!scanner) return;
    setActive(true);

    if (deviceId) {
      scanner.setCamera(deviceId).catch((e) => console.error(e));
    }
    scanner.start().catch((e) => console.error(e));
  }, [deviceId, scanner]);

  const changeCam = useCallback(
    (id: string) => {
      if (id === deviceId) return;
      setDeviceId(id);
      scanner?.setCamera(id).catch((e) => console.error(e));
    },
    [deviceId, scanner]
  );

  return {
    camRef: videoRef,
    result: scannedData,
    start: start,
    changeCam: changeCam,
    stop: restartScanner,
    active: active,
  };
};

export { useQrScanner };
