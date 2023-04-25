import { createNextApiHandler } from '@trpc/server/adapters/next';

import { env } from '~/env.mjs';
import { createTRPCContext } from '~/server/api/trpc';
import { appRouter } from '~/server/api/root';
import { type NextApiRequest, type NextApiResponse } from 'next';

// API handler
const nextApiHandler = createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    env.NODE_ENV === 'development'
      ? ({ path, error }) => {
          console.error(`❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`);
        }
      : undefined,
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return nextApiHandler(req, res);
}
