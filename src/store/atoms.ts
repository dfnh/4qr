import { atom } from 'jotai';
import { type Options } from 'qr-code-styling';
import { type QrFullSchema } from '~/schemas/QRCodeStyling';

// deprecated
const qrIdAtom = atom('');
const readQrIdAtom = atom((get) => get(qrIdAtom));

const displayQrAtom = atom<{
  qrId: string;
  keys?: { publicKey?: string; privateKey?: string };
}>({
  qrId: '',
  keys: { publicKey: undefined, privateKey: undefined },
});
const readDisplayQrAtom = atom((get) => get(displayQrAtom));

const slinkAtom = atom<{ success: boolean; info?: string }>({
  success: false,
  info: undefined,
});

const keysAtom = atom<{ privateKey?: string; publicKey?: string }>({
  privateKey: undefined,
  publicKey: undefined,
});
const readKeysAtom = atom((get) => get(keysAtom)); //notusing

const da = atom({
  data: 'https://4qr.vercel.app',
  width: 300,
  height: 300,
  type: 'canvas',
  dotsOptions: {
    color: '#000000',
    type: 'classy',
  },
  imageOptions: {
    crossOrigin: 'anonymous',
  },
} satisfies Options | QrFullSchema);

export {
  da,
  qrIdAtom,
  readQrIdAtom,
  slinkAtom,
  keysAtom,
  readKeysAtom,
  displayQrAtom,
  readDisplayQrAtom,
};
