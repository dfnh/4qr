import { useAtomValue } from 'jotai';
import React, { type ChangeEvent } from 'react';
import { da } from '~/store/atoms';
import { useEffect, useRef, useState } from 'react';

import QRCodeStyling, { type Extension, type Options } from 'qr-code-styling';

const qrCode = new QRCodeStyling({
  data: 'check',
  width: 300,
  height: 300,
  image: undefined,
  type: 'svg',
  dotsOptions: {
    color: undefined,
    type: 'square',
  },
  imageOptions: {
    crossOrigin: 'anonymous',
    margin: undefined,
  },
  qrOptions: {
    errorCorrectionLevel: 'H',
  },
});

const DisplayQrNew = () => {
  const [options, setOptions] = useState<Options>({
    data: 'check',
    width: 300,
    height: 300,
    image: undefined,
    type: 'svg',
    dotsOptions: {
      color: undefined,
      type: 'square',
    },
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: undefined,
    },
    qrOptions: {
      errorCorrectionLevel: 'H',
    },
  });
  const [fileExt, setFileExt] = useState<Extension>('svg');

  const ref = useRef<HTMLDivElement>(null);

  const daAtom = useAtomValue(da);

  useEffect(() => {
    if (ref.current) {
      qrCode.append(ref.current);
    }
  }, []);

  useEffect(() => {
    if (!qrCode) return;
    try {
      qrCode.update(daAtom);
      console.log(daAtom);
    } catch (err) {
      console.log(err as string);
    }
  }, [daAtom]);

  const onExtensionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFileExt(event.target.value as Extension);
  };

  const onDownloadClick = () => {
    if (!qrCode) return;
    qrCode
      .download({
        extension: fileExt,
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <div ref={ref} />
      <div>
        <select onChange={onExtensionChange} value={fileExt}>
          <option value="svg">SVG</option>
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
          <option value="webp">WEBP</option>
        </select>
        <button onClick={onDownloadClick}>Download</button>
      </div>
    </div>
  );
};

export default DisplayQrNew;
