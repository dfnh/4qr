import { z } from 'zod';

const urlCheck = z.string().url();

const isUrl = (text?: string) => urlCheck.safeParse(text).success;

export { isUrl, urlCheck };
