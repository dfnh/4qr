import { type PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { getLocation } from '~/helpers/getLocation';

const handleLocation = async ({
  ip,
  prisma,
  codeId,
}: {
  ip: string | null;
  prisma: PrismaClient;
  codeId: string;
}) => {
  const IP = ip ?? '';
  const location = await getLocation(IP);
  if (!location) {
    //? should i throw here
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Location error' });
  }

  const stat = await prisma.codeStatistic.create({
    data: {
      codeId: codeId,
      country: location.country,
      region: location.region,
      timezone: location.timezone,
      city: location.city,
      latitude: location.lat,
      longitude: location.lon,
    },
  });

  if (!stat) {
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Statistic error' });
  }
  return stat;
};

export { handleLocation };
