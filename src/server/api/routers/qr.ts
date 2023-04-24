import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '~/server/api/trpc';

import QRCode from 'easyqrcodejs-nodejs';
import { createQrSchema } from '~/schemas/createQr';

export const qrRouter = createTRPCRouter({
  createQr: publicProcedure.input(createQrSchema).mutation(({ ctx, input }) => {
    const qr = new QRCode(input);
    //   const smth = qr.toSVGText()
    const smth = qr.toDataURL() as string;

    return { url: smth };
  }),
});
