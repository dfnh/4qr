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
import { slinkNewAtom } from './slinkNewAtom';

const useReadQrIdAtom = () => useAtom(readQrIdAtom);

const useSetQrIdAtom = () => useSetAtom(qrIdAtom);

// const useDisplayQrIdAtom = () => useAtom(displayQrAtom);
const useSetDisplayQrIdAtom = () => useSetAtom(displayQrAtom);
const useReadDisplayQrIdAtom = () => useAtom(readDisplayQrAtom);

const useSlinkAtomValue = () => useAtomValue(slinkAtom);
const useSetSlinkAtom = () => useSetAtom(slinkAtom);

const useSetKeysAtom = () => useSetAtom(keysAtom);
const useReadKeysAtom = () => useAtom(readKeysAtom);

const useKeysAtomValue = () => useAtomValue(keysAtom);
const useSlinkNewAtomValue = () => useAtomValue(slinkNewAtom);
const useSetSlinkNewAtom = () => useSetAtom(slinkNewAtom);

export {
  useReadQrIdAtom,
  useSetQrIdAtom,
  useSlinkAtomValue,
  useSetSlinkAtom,
  useSetKeysAtom,
  useReadKeysAtom,
  useSetDisplayQrIdAtom,
  useReadDisplayQrIdAtom,
  useKeysAtomValue,
  useSlinkNewAtomValue,
  useSetSlinkNewAtom,
};
