import { type PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { type NextRequest } from 'next/server';
// import { getLocation } from '~/helpers/getLocation';

type handleLocationProps = {
  geo: NextRequest['geo'];
  prisma: PrismaClient;
  codeId: string;
};
const handleLocation = async ({ geo, prisma, codeId }: handleLocationProps) => {
  const location = geo;
  if (!location) {
    //? should i throw here
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Location error' });
  }

  const stat = await prisma.codeStatistic.create({
    data: {
      codeId: codeId,
      country: location.country,
      region: location.region,
      city: location.city,
      latitude: location.latitude || undefined,
      longitude: location.longitude || undefined,
      // timezone: location.timezone,
    },
  });

  if (!stat) {
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Statistic error' });
  }
  return stat;
};

export { handleLocation };
