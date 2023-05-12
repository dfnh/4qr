import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  displayQrAtom,
  keysAtom,
  qrIdAtom,
  readDisplayQrAtom,
  readKeysAtom,
  readQrIdAtom,
  slinkAtom,
} from './atoms';
import { slinkNewAtom } from './qrAtom';

const useReadQrIdAtom = () => useAtom(readQrIdAtom);

const useSetQrIdAtom = () => useSetAtom(qrIdAtom);

// const useDisplayQrIdAtom = () => useAtom(displayQrAtom);
const useSetDisplayQrIdAtom = () => useSetAtom(displayQrAtom);
const useReadDisplayQrIdAtom = () => useAtom(readDisplayQrAtom);

const useSlinkAtom = () => useAtom(slinkAtom);

const useSetKeysAtom = () => useSetAtom(keysAtom);
const useReadKeysAtom = () => useAtom(readKeysAtom);

const useKeysAtomValue = () => useAtomValue(keysAtom);
const useSlinkNewAtomValue = () => useAtomValue(slinkNewAtom);

export {
  useReadQrIdAtom,
  useSetQrIdAtom,
  useSlinkAtom,
  useSetKeysAtom,
  useReadKeysAtom,
  useSetDisplayQrIdAtom,
  useReadDisplayQrIdAtom,
  useKeysAtomValue,
  useSlinkNewAtomValue,
};
