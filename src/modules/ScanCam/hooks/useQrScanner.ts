import { useCallback, useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';

const useQrScanner = () => {
  const [scanner, setScanner] = useState<QrScanner | null>(null);
  const [scannedData, setScannedData] = useState<string>('');
  const [active, setActive] = useState(false);
  const [deviceId, setDeviceId] = useState<string>();

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const newScanner = new QrScanner(
      videoRef.current,
      (result) => {
        newScanner.stop();
        setActive(false);
        setScannedData(result.data);
      },
      { returnDetailedScanResult: true, highlightScanRegion: true }
    );
    setScanner(newScanner);

    return () => {
      newScanner.destroy();
      setScanner(null);
    };
  }, []);

  const start = useCallback(() => {
    if (!scanner) return;
    setActive(true);
    if (!!deviceId) {
      scanner.setCamera(deviceId).catch((e) => console.error(e));
    }
    scanner.start().catch((e) => console.error(e));
  }, [deviceId, scanner]);

  const stop = useCallback(() => {
    if (!scanner) return;
    setActive(false);
    scanner.stop();
  }, [scanner]);

  const changeCam = useCallback(
    (id: string) => {
      if (id === deviceId) return;
      setDeviceId(id);
      scanner?.setCamera(id).catch((e) => console.error(e));
    },
    [deviceId, scanner]
  );

  const toggle = useCallback(() => {
    if (active) {
      stop();
      return;
    }
    start();
  }, [active, start, stop]);

  const clean = useCallback(() => {
    scanner?.stop();
    scanner?.destroy();
    setScanner(null);
  }, [scanner]);

  return {
    camRef: videoRef,
    result: scannedData,
    start: start,
    stop: stop,
    clean: clean,
    changeCam: changeCam,
    active: active,
    toggle: toggle,
  };
};

export { useQrScanner };
