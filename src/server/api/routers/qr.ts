import { createTRPCRouter, publicProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import QRCode from 'easyqrcodejs-nodejs';
import { createQrSchema } from '~/schemas/createQr';
import { nanoid } from '~/utils/nanoid';
import { hashPassword } from '~/helpers/bcrypt';
import { getBaseUrl } from '~/helpers/getBaseUrl';

export const qrRouter = createTRPCRouter({
  createQr: publicProcedure.input(createQrSchema).mutation(async ({ ctx, input }) => {
    const qr = new QRCode(input.text);
    //   const smth = qr.toSVGText()

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

    return { url: link, qrcode: qr64, id: code.id };
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
});
