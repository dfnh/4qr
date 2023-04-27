import { useAtom } from 'jotai';
import { readQrIdAtom } from './atoms';

const useReadQrIdAtom = () => useAtom(readQrIdAtom);

export { useReadQrIdAtom };
