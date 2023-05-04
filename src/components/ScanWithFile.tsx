import Image from 'next/image';
import QrScanner from 'qr-scanner';
import { useCallback, useState, type ChangeEvent } from 'react';

import { InputFile } from '~/components/InputFile';

const ScanWithFile = () => {
  const [im, setIm] = useState<string>('');
  const [data, setData] = useState<string>('data will be here');

  const handleImageChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const f = event.target.files?.[0];
    if (!f) return; // todo throw error or smth mb

    QrScanner.scanImage(f, { returnDetailedScanResult: true })
      .then((result) => setData(result.data))
      .catch((error) => setData(error as string));

    setIm(URL.createObjectURL(f));
  }, []);

  return (
    <>
      <div className="container max-w-md">
        <InputFile
          labelTitle="Select qr code"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      {data && <p className="break-all">{data}</p>}
      {im && <Image src={im} alt="Users qr code" width={128} height={128} />}
    </>
  );
};

export default ScanWithFile;
