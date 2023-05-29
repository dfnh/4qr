import QrScanner from 'qr-scanner';
import { useCallback, useState } from 'react';
import DragAndDrop from './DragAndDrop';

const ScanFile = () => {
  const [data, setData] = useState<string>('');

  const onSuccess = useCallback((f: File) => {
    QrScanner.scanImage(f, { returnDetailedScanResult: true })
      .then((result) => setData(result.data))
      .catch((error) => setData(error as string));
  }, []);

  return (
    <div className="container flex flex-col items-center gap-6">
      <div className="w-full max-w-md">
        <DragAndDrop onSuccess={onSuccess} />
      </div>
      {data && <p className="break-all">{data}</p>}
    </div>
  );
};

export default ScanFile;
