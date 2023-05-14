import { z } from 'zod';

const emailCheck = z.string().trim().email({ message: 'Not a valid email address' });

const isEmail = (email: string) => emailCheck.safeParse(email).success;

export { isEmail, emailCheck };
