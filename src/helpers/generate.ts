import { nanoid } from 'nanoid/async';
import { nanoid as nanoidSync } from 'nanoid';

const generate = async (length = 20) => {
  const random = await nanoid(length);
  return random;
};

const generateSync = (length = 20) => {
  const random = nanoidSync(length);
  return random;
};

export { generate, generateSync };
