import { TRPCError } from '@trpc/server';
import { isUrl } from '~/helpers/validation/isUrl';
import { codeProcedureSchema } from '~/schemas/codeProcedure';
import { publicProcedure, publicWithIpProcedure } from '../trpc';
import { z } from 'zod';

const codeProcedure = publicWithIpProcedure
  .input(codeProcedureSchema)
  .use(async ({ ctx, input, next }) => {
    const code = await ctx.prisma.code.findFirst({
      where: { shorturl: input.slink },
    });
    if (!code) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Code not found' });
    const isurl = isUrl(code.info);
    // const passReq = code.password !== null; // :c

    return next({ ctx: { code, isUrl: isurl } });
  });

const geoProcedure = publicProcedure
  .input(
    z
      .object({
        geo: z
          .object({
            city: z.string(),
            country: z.string(),
            region: z.string(),
            latitude: z.string(),
            longitude: z.string(),
          })
          .partial(),
      })
      .optional()
  )
  .use(async ({ input, next }) => {
    return next({ ctx: { geo: input?.geo } });
  });

export { codeProcedure, geoProcedure };
