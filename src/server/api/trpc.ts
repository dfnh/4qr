import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { type Session } from 'next-auth';

import { getServerAuthSession } from '~/server/auth';
import { prisma } from '~/server/db';

// type CreateContextOptions = { session: Session | null };
export interface CreateInnerContextOptions extends Partial<CreateNextContextOptions> {
  session: Session | null;
}

/**
 * This helper generates the "internals" for a tRPC context
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */
export const createInnerTRPCContext = (opts: CreateInnerContextOptions) => {
  return {
    ...opts,
    // session: opts.session,
    prisma,
  };
};

/**
 * actual context for router
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts?: CreateNextContextOptions) => {
  if (!opts?.req || !opts?.res) throw new Error('createTRPCContext not req or res');

  const session = await getServerAuthSession({ req: opts.req, res: opts.res });
  const context = createInnerTRPCContext({
    session,
    req: opts?.req,
  });

  return {
    ...context,
  };
};

/** tRPC API initialization */
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/** router & procedure  */

/**
 * create new routers and sub-routers
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/** Public (unauthenticated) procedure */
export const publicProcedure = t.procedure;

/** Reusable middleware that enforces users are logged in before running the procedure */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Protected (authenticated) procedure
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

import { getIp } from '~/helpers/getIp';

const withIpFromReq = t.middleware(({ ctx, next }) => {
  if (!ctx.req) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'You are missing `req` in your call',
    });
  }
  const ip = getIp(ctx.req);
  return next({
    ctx: { ip: ip, req: ctx.req },
  });
});

export const publicWithIpProcedure = t.procedure.use(withIpFromReq);
