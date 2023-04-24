import { createTRPCRouter } from './trpc';
import { exampleRouter } from './routers/example';
import { qrRouter } from './routers/qr';

/** primary router */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  qr: qrRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
