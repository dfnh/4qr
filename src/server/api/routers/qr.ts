import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { asOptionalField } from '~/helpers/asOptionalField';
import { hashPassword, verifyPassword } from '~/helpers/bcrypt';
import { generateKeys, signMessage, verifyMessageSignature } from '~/helpers/crypto';
import { schemaForFormPassword, schemaForFormPublicKey } from '~/schemas/codeProcedure';
import { handleLocation } from '../helpers/locationLogic';
import { codeProcedure } from '../procedures/codeProcedure';
import { createTRPCRouter, publicProcedure } from '../trpc';
// import { generateQR } from '~/helpers/generateQr';
// import { getBaseUrl, getSlinkUrl } from '~/helpers/getBaseUrl';
// import { createQrBusinessPartSchema, createQrSchema } from '~/schemas/createQr';
// import { nanoid } from '~/utils/nanoid';

export const qrRouter = createTRPCRouter({
  createQrNew: publicProcedure
    .input(
      z.object({
        data: z.string().min(1),
        sign: z.boolean().default(false),
        slink: asOptionalField(z.string().min(1)),
        password: asOptionalField(z.string().min(1)),
        image64: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userid = ctx.session?.user.id;

      let hashedPassword: string | undefined = undefined;
      if (input.password && !input.sign) {
        hashedPassword = await hashPassword(input.password);
      }

      let publicKey: string | undefined = undefined;
      let privateKey: string | undefined = undefined;
      let signature: string | undefined = undefined;
      if (!!input.slink && input.sign) {
        [publicKey, privateKey] = generateKeys();
        const message = `${input.data}${input.image64}`;
        signature = signMessage(message, privateKey);
      }

      const code = await ctx.prisma.code.create({
        data: {
          info: input.data,
          userId: userid,
          password: hashedPassword,
          image: input.image64,
          shorturl: input.slink,
          signature: signature,
        },
      });
      if (!code) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      console.log(code);

      return { publicKey, privateKey };
    }),

  visitSlink: codeProcedure.query(async ({ ctx, input }) => {
    const { code, isUrl } = ctx;

    const responseObj = {
      info: undefined as string | undefined,
      qrUrl: code.image,
      slink: code.shorturl,
      isUrl,
      success: false,
      signature: false,
      password: false,
    };

    if (code.password) {
      responseObj.password = true;
      if (!input.password) return { ...responseObj };

      const success = await verifyPassword(input.password, code.password);
      if (!success) return { ...responseObj };
    }

    if (!!code.signature) {
      responseObj.signature = true;
      return { ...responseObj };
    }

    const stat = await handleLocation({
      ip: ctx.ip,
      prisma: ctx.prisma,
      codeId: code.id,
    });

    return {
      ...responseObj,
      info: code.info,
      success: true,
    };
  }),

  getSlinkWithPass: codeProcedure
    .input(schemaForFormPassword)
    .mutation(async ({ ctx, input }) => {
      const { code, isUrl } = ctx;

      //! cause it only for password ones
      if (!code.password) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      if (!input.password) throw new TRPCError({ code: 'BAD_REQUEST' });

      const success = await verifyPassword(input.password, code.password);
      if (!success)
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Wrong password' });

      const stat = await handleLocation({
        ip: ctx.ip,
        prisma: ctx.prisma,
        codeId: code.id,
      });

      return { info: code.info, qrUrl: code.image, isUrl, success: success };
    }),
  getSlinkWithSignature: codeProcedure
    .input(schemaForFormPublicKey)
    .mutation(async ({ ctx, input }) => {
      const { code, isUrl } = ctx;

      if (!code.signature || !code.image)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      if (!input.publicKey) throw new TRPCError({ code: 'BAD_REQUEST' });

      const message = `${code.info}${code.image}`;

      const publicKeyTrimmed = input.publicKey.replace(/\\n/g, '\n').trim();

      const isVerified = verifyMessageSignature(
        message,
        publicKeyTrimmed,
        code.signature
      );
      if (!isVerified) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Wrong key' });

      const stat = await handleLocation({
        ip: ctx.ip,
        prisma: ctx.prisma,
        codeId: code.id,
      });

      return { info: code.info, qrUrl: code.image, isUrl, success: isVerified };
    }),

  getKeysAndSign: publicProcedure
    .input(z.object({ message: z.string().min(1) }))
    .query(({ input }) => {
      const [publicKey, privateKey] = generateKeys();
      const signature = signMessage(input.message, privateKey);

      return { signature, publicKey, privateKey };
    }),
});
