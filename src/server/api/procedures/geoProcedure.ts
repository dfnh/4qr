import { z } from 'zod';
import { publicProcedure } from '../trpc';

const geoProcedure = publicProcedure
  .input(
    z.object({
      geo: z
        .object({
          city: z.string(),
          country: z.string(),
          region: z.string(),
          latitude: z.string(),
          longitude: z.string(),
        })
        .partial()
        .optional(),
    })
  )
  .use(async ({ input, next }) => {
    return next({ ctx: { geo: input?.geo } });
  });

export { geoProcedure };
