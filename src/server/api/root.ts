import { createTRPCRouter } from './trpc';
import { qrRouter } from './routers/qr';
import { userRouter } from './routers/user';

/** primary router */
export const appRouter = createTRPCRouter({
  qr: qrRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
