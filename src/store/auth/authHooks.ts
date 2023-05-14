import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { signInLoadingAtom } from './authAtom';

const useSignInLoadingAtom = () => useAtom(signInLoadingAtom);

const useSetSignInLoading = () => useSetAtom(signInLoadingAtom);

const useSignInLoadingValue = () => useAtomValue(signInLoadingAtom);

export { useSignInLoadingAtom, useSetSignInLoading, useSignInLoadingValue };
