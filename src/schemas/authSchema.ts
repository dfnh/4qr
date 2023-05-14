import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().trim().email({ message: 'Not a valid email address' }),
  password: z
    .string()
    .trim()
    .min(6, { message: 'Password should be at least 6 characters' }),
});

export type SignInSchema = z.infer<typeof signInSchema>;

export const signUpSchema = signInSchema
  .extend({
    name: z.string().trim().min(1),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: `Passwords don't match`,
    path: ['confirmPassword'],
  });

export type SignUpSchema = z.infer<typeof signUpSchema>;
