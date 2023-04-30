import { atom } from 'jotai';

const qrIdAtom = atom('');

const readQrIdAtom = atom((get) => get(qrIdAtom));

const slinkAtom = atom<{ success: boolean; info?: string }>({
  success: false,
  info: undefined,
});

export { qrIdAtom, readQrIdAtom, slinkAtom };
