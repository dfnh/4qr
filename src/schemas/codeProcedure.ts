import { z } from 'zod';
import { asOptionalField as opt } from '~/helpers/asOptionalField';

export const codeProcedureCoreSchema = z.object({
  password: opt(z.string().min(1)),
});

export type CodeProcedureCoreSchema = z.infer<typeof codeProcedureCoreSchema>;

export const codeProcedureSchema = codeProcedureCoreSchema.extend({
  slink: z.string().min(1),
});

export type CodeProcedureSchema = z.infer<typeof codeProcedureSchema>;

export const schemaForForm = z.object({ password: z.string().min(1) });
export type SchemaForForm = z.infer<typeof schemaForForm>;
