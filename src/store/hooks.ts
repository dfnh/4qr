import { useAtom, useSetAtom } from 'jotai';
import { qrIdAtom, readQrIdAtom } from './atoms';

const useReadQrIdAtom = () => useAtom(readQrIdAtom);

const useSetQrIdAtom = () => useSetAtom(qrIdAtom);

export { useReadQrIdAtom, useSetQrIdAtom };
