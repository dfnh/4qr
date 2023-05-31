import { type PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { type NextRequest } from 'next/server';
import { getBaseUrl } from '~/helpers/getBaseUrl';
// import { env } from '~/env.mjs';
// import { getLocation } from '~/helpers/getLocation';

// todo do smth with this - fat
const handleLocation = async ({
  // ip,
  prisma,
  codeId,
}: {
  ip: string | null;
  prisma: PrismaClient;
  codeId: string;
}) => {
  const location = (await (
    await fetch(getBaseUrl('/api/geo'))
  ).json()) as NextRequest['geo'];
  if (!location) {
    console.error('Location error');
  }

  console.log({ location });

  const stat = await prisma.codeStatistic.create({
    data: {
      codeId: codeId,
      country: location?.country,
      region: location?.region,
      city: location?.city,
      latitude: location?.latitude,
      longitude: location?.longitude,
    },
  });

  if (!stat) {
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Statistic error' });
  }
  return stat;
};

export { handleLocation };
