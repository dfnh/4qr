import { TRPCError } from '@trpc/server';
import { publicWithIpProcedure } from '../trpc';
import { isUrl } from '~/helpers/isUrl';
import { codeProcedureSchema } from '~/schemas/codeProcedure';

const codeProcedure = publicWithIpProcedure
  .input(codeProcedureSchema)
  .use(async ({ ctx, input, next }) => {
    const code = await ctx.prisma.code.findUnique({
      where: { shorturl: input.slink },
    });
    if (!code) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Code not found' });
    const isurl = isUrl(code.info);
    // const passReq = code.password !== null; // :c

    return next({ ctx: { code, isUrl: isurl } });
  });

export { codeProcedure };
