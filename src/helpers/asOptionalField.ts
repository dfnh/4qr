import { z } from 'zod';

const emptyStringToUndefined = z.literal('').transform(() => undefined);

const asOptionalField = <T extends z.ZodTypeAny>(schema: T) => {
  return schema.optional().or(emptyStringToUndefined);
};

export { asOptionalField };
