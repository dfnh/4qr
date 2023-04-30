import { useAtom, useSetAtom } from 'jotai';
import { qrIdAtom, readQrIdAtom, slinkAtom } from './atoms';

const useReadQrIdAtom = () => useAtom(readQrIdAtom);

const useSetQrIdAtom = () => useSetAtom(qrIdAtom);

const useSlinkAtom = () => useAtom(slinkAtom);

export { useReadQrIdAtom, useSetQrIdAtom, useSlinkAtom };
