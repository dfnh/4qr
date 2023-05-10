import { atom } from 'jotai';
import QRCodeStyling from 'qr-code-styling';
// import { type QrFullSchema } from '~/schemas/QRCodeStyling';

const qrCodeAtom = atom(
  new QRCodeStyling({
    data: 'default',
    width: 300,
    height: 300,
    image: undefined,
    type: 'canvas',
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
  })
);

export { qrCodeAtom };
