// import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '~/server/api/trpc';
import { TRPCError } from '@trpc/server';
import QRCode from 'easyqrcodejs-nodejs';

import { createQrSchema } from '~/schemas/createQr';
import { nanoid } from '~/utils/nanoid';
import { hashPassword } from '~/utils/bcrypt';

export const qrRouter = createTRPCRouter({
  createQr: publicProcedure.input(createQrSchema).mutation(async ({ ctx, input }) => {
    const qr = new QRCode(input);
    //   const smth = qr.toSVGText()
    const qr64 = qr.toDataURL() as string;

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
        map: qr64,
        shorturl: shorturl,
      },
    });
    if (!code) {
      throw new TRPCError({ code: 'BAD_REQUEST' });
    }

    return { url: shorturl, qrcode: qr64 };
  }),
});
