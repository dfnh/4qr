import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { hashPassword } from '~/helpers/bcrypt';
import { signUpSchema } from '~/schemas/authSchema';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(({ ctx }) => {
    return ctx.session.user;
  }),

  signUp: publicProcedure.input(signUpSchema).mutation(async ({ ctx, input }) => {
    const userFromSession = ctx.session?.user;
    if (userFromSession) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'User already logged in' });
    }

    const userPrevious = await ctx.prisma.user.findFirst({
      where: { email: input.email },
    });
    if (userPrevious) {
      // console.log(userPrevious);
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'User with this email is already registered',
      });
    }

    const hash = await hashPassword(input.password);
    const user = await ctx.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hash,
      },
    });
    if (!user) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

    return { email: user.email };
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

  deleteQr: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const code = await ctx.prisma.code.findFirst({
        where: { id: input.id },
      });
      if (!code)
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Code was not found' });

      try {
        await ctx.prisma.code.delete({
          where: { id: code.id },
        });
        return true;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: (error as Error)?.message ?? 'Cant delete code',
        });
      }
    }),
});
