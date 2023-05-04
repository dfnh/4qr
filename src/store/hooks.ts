import { useAtom, useSetAtom } from 'jotai';
import {
  displayQrAtom,
  keysAtom,
  qrIdAtom,
  readDisplayQrAtom,
  readKeysAtom,
  readQrIdAtom,
  slinkAtom,
} from './atoms';

const useReadQrIdAtom = () => useAtom(readQrIdAtom);

const useSetQrIdAtom = () => useSetAtom(qrIdAtom);

// const useDisplayQrIdAtom = () => useAtom(displayQrAtom);
const useSetDisplayQrIdAtom = () => useSetAtom(displayQrAtom);
const useReadDisplayQrIdAtom = () => useAtom(readDisplayQrAtom);

const useSlinkAtom = () => useAtom(slinkAtom);

const useSetKeysAtom = () => useSetAtom(keysAtom);
const useReadKeysAtom = () => useAtom(readKeysAtom);

export {
  useReadQrIdAtom,
  useSetQrIdAtom,
  useSlinkAtom,
  useSetKeysAtom,
  useReadKeysAtom,
  useSetDisplayQrIdAtom,
  useReadDisplayQrIdAtom,
};
