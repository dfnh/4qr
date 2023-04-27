import { atom } from 'jotai';

const qrIdAtom = atom('');

const readQrIdAtom = atom((get) => get(qrIdAtom));

export { qrIdAtom, readQrIdAtom };
