import { createTRPCRouter, publicProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import QRCode from 'easyqrcodejs-nodejs';
import { createQrSchema } from '~/schemas/createQr';
import { nanoid } from '~/utils/nanoid';
import { hashPassword, verifyPassword } from '~/helpers/bcrypt';
import { getBaseUrl } from '~/helpers/getBaseUrl';
import { getLocation } from '~/helpers/getLocation';
import { codeProcedure } from '../procedures/codeProcedure';

export const qrRouter = createTRPCRouter({
  createQr: publicProcedure.input(createQrSchema).mutation(async ({ ctx, input }) => {
    let qr: QRCode;
    let slink: string | undefined = undefined;
    let link: string | undefined = undefined;
    const userid = ctx.session?.user.id;

    if (!input.slink) {
      qr = new QRCode(input.text);
    } else {
      slink = await nanoid();
      link = getBaseUrl(`/s/${slink}`);
      qr = new QRCode(link);
    }

    const [qr64, hashedPassword] = await Promise.all([
      qr.toDataURL() as Promise<string>,
      input.password ? hashPassword(input.password) : Promise.resolve(undefined),
    ]);

    const code = await ctx.prisma.code.create({
      data: {
        info: input.text,
        userId: userid,
        password: hashedPassword,
        image: qr64,
        shorturl: slink,
      },
    });
    if (!code) {
      throw new TRPCError({ code: 'BAD_REQUEST' });
    }
    console.log(code);

    // const link = getBaseUrl(`/s/${code?.shorturl ?? ''}`);

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
  visitSlink: codeProcedure.query(async ({ ctx, input }) => {
    const { code, isUrl } = ctx;

    if (code.password) {
      if (!input.password)
        return { qrUrl: code.image, slink: code.shorturl, isUrl, success: false };

      const success = await verifyPassword(input.password, code.password);
      if (!success) return { qrUrl: code.image, slink: code.shorturl, isUrl, success };
    }

    const ip = '178.44.19.217'; //! mock ip cause my ip '::1'
    // const ip = ctx.ip ?? '';
    const location = await getLocation(ip);
    if (!location) {
      //? i think it ok not to throw here
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }

    await ctx.prisma.codeStatistic.create({
      data: {
        codeId: code.id,
        country: location.country,
        region: location.region,
        timezone: location.timezone,
        city: location.city,
        latitude: location.lat,
        longitude: location.lon,
      },
    });

    return {
      info: code.info,
      qrUrl: code.image,
      slink: code.shorturl,
      isUrl,
      success: true,
    };
  }),

  getSlinkWithPass: codeProcedure.mutation(async ({ ctx, input }) => {
    const { code, isUrl } = ctx;

    //! cause it only for password ones
    if (!code.password) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    if (!input.password) throw new TRPCError({ code: 'BAD_REQUEST' });

    const success = await verifyPassword(input.password, code.password);
    if (!success) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Wrong password' });

    const ip = '178.44.19.217'; //! mock ip cause my ip '::1'
    // const ip = ctx.ip ?? '';
    const location = await getLocation(ip);
    if (!location) {
      //? should i throw here
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }

    await ctx.prisma.codeStatistic.create({
      data: {
        codeId: code.id,
        country: location.country,
        region: location.region,
        timezone: location.timezone,
        city: location.city,
        latitude: location.lat,
        longitude: location.lon,
      },
    });

    // console.log({ info: code.info, qrUrl: code.image, isUrl, success });
    return { info: code.info, qrUrl: code.image, isUrl, success };
  }),
});
