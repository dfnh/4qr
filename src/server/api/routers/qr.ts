import { createTRPCRouter, publicProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import QRCode from 'easyqrcodejs-nodejs';
import { createQrSchema } from '~/schemas/createQr';
import { nanoid } from '~/utils/nanoid';
import { hashPassword } from '~/utils/bcrypt';

export const qrRouter = createTRPCRouter({
  createQr: publicProcedure.input(createQrSchema).mutation(async ({ ctx, input }) => {
    const qr = new QRCode(input.text);
    //   const smth = qr.toSVGText()
    const qr64 = (await qr.toDataURL()) as string;

    const userid = ctx.session?.user.id;

    const shorturl = await nanoid();

    const hashedPassword = input.password
      ? await hashPassword(input.password)
      : undefined;

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

    //todo return slink
    return { url: shorturl, qrcode: qr64, id: code.id };
  }),

  getQrById: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const code = await ctx.prisma.code.findFirst({ where: { id: input.id } });
      if (!code) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      return { qrUrl: code.image };
    }),
});
