import { customAlphabet } from 'nanoid/async';

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-';
const nanoid = customAlphabet(alphabet, 10);

export { nanoid };
