import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { TRPCError } from '@trpc/server';

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(({ ctx }) => {
    return ctx.session.user;
  }),

  getQrList: protectedProcedure.query(async ({ ctx }) => {
    const codes = await ctx.prisma.code.findMany({
      where: { userId: ctx.session.user.id },
      select: { info: true, shorturl: true, createdAt: true, id: true },
    });
    // if (codes.length !== 0) throw new TRPCError({ code: 'BAD_REQUEST' });

    return codes;
  }),

  getQrStats: protectedProcedure
    .input(z.object({ slink: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const code = await ctx.prisma.code.findFirst({
        where: { shorturl: input.slink },
        include: { CodeStatistic: true },
      });
      if (!code) throw new TRPCError({ code: 'BAD_REQUEST' });

      return code;
    }),
});
