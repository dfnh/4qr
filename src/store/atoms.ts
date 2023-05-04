import { atom } from 'jotai';

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

export {
  qrIdAtom,
  readQrIdAtom,
  slinkAtom,
  keysAtom,
  readKeysAtom,
  displayQrAtom,
  readDisplayQrAtom,
};
