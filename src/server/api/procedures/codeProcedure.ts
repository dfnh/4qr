import { TRPCError } from '@trpc/server';
import { isUrl } from '~/helpers/validation/isUrl';
import { codeProcedureSchema } from '~/schemas/codeProcedure';
import { geoProcedure } from './geoProcedure';

const codeProcedure = geoProcedure
  .input(codeProcedureSchema)
  .use(async ({ ctx, input, next }) => {
    const code = await ctx.prisma.code.findFirst({
      where: { shorturl: input.slink },
    });
    if (!code) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Code not found' });
    const isurl = isUrl(code.info);
    const withInput = !!code.password || !!code.signature;

    return next({ ctx: { code, isUrl: isurl, withInput } });
  });

export { codeProcedure };
