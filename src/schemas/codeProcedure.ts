import { z } from 'zod';
import { asOptionalField as opt } from '~/helpers/asOptionalField';

export const codeProcedureSchema = z.object({
  slink: z.string().min(1),
  password: opt(z.string().min(1)),
});

export type CodeProcedureSchema = z.infer<typeof codeProcedureSchema>;

export const schemaForFormPassword = z.object({ password: z.string().min(1) });
export type SchemaForFormPassword = z.infer<typeof schemaForFormPassword>;

export const schemaForFormPublicKey = z.object({ publicKey: z.string().min(1) });
export type SchemaForFormPublicKey = z.infer<typeof schemaForFormPublicKey>;
