import { createTRPCRouter, publicProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { createQrSchema } from '~/schemas/createQr';
import { nanoid } from '~/utils/nanoid';
import { hashPassword, verifyPassword } from '~/helpers/bcrypt';
import { getBaseUrl, getSlinkUrl } from '~/helpers/getBaseUrl';
import { codeProcedure } from '../procedures/codeProcedure';
import { handleLocation } from '../helpers/locationLogic';

import { generateQR } from '~/helpers/generateQr';
import { generateKeys, signMessage } from '~/helpers/crypto';

export const qrRouter = createTRPCRouter({
  createQr: publicProcedure.input(createQrSchema).mutation(async ({ ctx, input }) => {
    let qr: string | undefined;
    let slink: string | undefined = undefined;
    let link: string | undefined = undefined;
    const userid = ctx.session?.user.id;

    if (!input.slink) {
      qr = await generateQR(input.text);
    } else {
      slink = await nanoid();
      link = getSlinkUrl(slink);
      qr = await generateQR(link);
    }

    const [hashedPassword] = await Promise.all([
      // qr.toDataURL() as Promise<string>,
      input.password ? hashPassword(input.password) : Promise.resolve(undefined),
    ]);

    let publicKey: string | undefined = undefined;
    let privateKey: string | undefined = undefined;
    let signature: string | undefined = undefined;
    if (!!slink && input.sign) {
      [publicKey, privateKey] = generateKeys();
      signature = signMessage(input.text, privateKey);
    }

    const code = await ctx.prisma.code.create({
      data: {
        info: input.text,
        userId: userid,
        password: hashedPassword,
        image: qr,
        shorturl: slink,
        signature: signature,
      },
    });
    if (!code) throw new TRPCError({ code: 'BAD_REQUEST' });

    console.log(code);
    // const link = getBaseUrl(`/s/${code?.shorturl ?? ''}`);

    return { url: link, qrUrl: qr, id: code.id, publicKey, privateKey };
  }),

  getQrById: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const code = await ctx.prisma.code.findFirst({ where: { id: input.id } });
      //\ !code || ctx.session?.user.id === code?.userId
      if (!code) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }
      const url = code.shorturl ? getSlinkUrl(code.shorturl) : undefined;

      return { qrUrl: code.image, url: url };
    }),

  visitSlink: codeProcedure.query(async ({ ctx, input }) => {
    const { code, isUrl } = ctx;

    if (code.password) {
      if (!input.password)
        return { qrUrl: code.image, slink: code.shorturl, isUrl, success: false };

      const success = await verifyPassword(input.password, code.password);
      if (!success) return { qrUrl: code.image, slink: code.shorturl, isUrl, success };
    }

    const stat = await handleLocation({
      ip: ctx.ip,
      prisma: ctx.prisma,
      codeId: code.id,
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

    const stat = await handleLocation({
      ip: ctx.ip,
      prisma: ctx.prisma,
      codeId: code.id,
    });

    // console.log({ info: code.info, qrUrl: code.image, isUrl, success });
    return { info: code.info, qrUrl: code.image, isUrl, success };
  }),
});
