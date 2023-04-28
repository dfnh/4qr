import { createTRPCRouter, publicProcedure, publicWithIpProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import QRCode from 'easyqrcodejs-nodejs';
import { createQrSchema } from '~/schemas/createQr';
import { nanoid } from '~/utils/nanoid';
import { hashPassword } from '~/helpers/bcrypt';
import { getBaseUrl } from '~/helpers/getBaseUrl';
import { getLocation } from '~/helpers/getLocation';

export const qrRouter = createTRPCRouter({
  createQr: publicProcedure.input(createQrSchema).mutation(async ({ ctx, input }) => {
    const qr = new QRCode(input.text);

    const [qr64, shorturl, hashedPassword] = await Promise.all([
      qr.toDataURL() as Promise<string>,
      input.slink ? nanoid() : Promise.resolve(undefined),
      input.password ? hashPassword(input.password) : Promise.resolve(undefined),
    ]);

    const userid = ctx.session?.user.id;

    const code = await ctx.prisma.code.create({
      data: {
        info: input.text,
        userId: userid,
        password: hashedPassword,
        image: qr64,
        shorturl: shorturl,
      },
    });
    if (!code) {
      throw new TRPCError({ code: 'BAD_REQUEST' });
    }
    console.log(code);

    const link = getBaseUrl(`/s/${code?.shorturl ?? ''}`);

    return { url: link, qrUrl: qr64, id: code.id };
  }),

  getQrById: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const code = await ctx.prisma.code.findFirst({ where: { id: input.id } });
      //\ !code || ctx.session?.user.id === code?.userId
      if (!code) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      return { qrUrl: code.image };
    }),

  // fixme mock ip
  visitSlink: publicWithIpProcedure
    .input(z.object({ slink: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const code = await ctx.prisma.code.findFirst({
        where: { shorturl: input.slink },
      });
      if (!code) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      const ip = '178.44.19.217'; //! mock ip cause my ip '::1'
      // const ip = ctx.ip ?? '';

      const location = await getLocation(ip);
      if (!location) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
      const [lat, lon] = location.ll;

      await ctx.prisma.codeStatistic.create({
        data: {
          codeId: code.id,
          country: location.country,
          region: location.region,
          timezone: location.timezone,
          city: location.city,
          latitude: lat,
          longitude: lon,
        },
      });

      // console.log(codeStat);
      // console.log(code);

      return { qrUrl: code.image, id: code.id };
    }),
});
