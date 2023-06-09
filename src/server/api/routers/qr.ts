import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { asOptionalField } from '~/helpers/asOptionalField';
import { hashPassword, verifyPassword } from '~/helpers/bcrypt';
import { generateKeys, signMessage, verifyMessageSignature } from '~/helpers/crypto';
import { schemaForFormPassword, schemaForFormPublicKey } from '~/schemas/codeProcedure';
import { handleLocation } from '../helpers/locationLogic';
import { codeProcedure } from '../procedures/codeProcedure';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const qrRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.code.findMany();
  }),

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
      // console.log(code);

      return { publicKey, privateKey };
    }),

  visitSlink: codeProcedure.query(async ({ ctx, input }) => {
    const { code, isUrl, withInput, geo } = ctx;

    const responseObj = {
      info: undefined as string | undefined,
      image: code.image,
      slink: code.shorturl,
      isUrl: isUrl,
      withInput: withInput,
      withSignature: !!code.signature,
      withPassword: !!code.password,
      success: false,
    };

    if (code.password) {
      if (!input.password) return { ...responseObj };

      const success = await verifyPassword(input.password, code.password);
      if (!success) return { ...responseObj };
    }

    if (!!code.signature) {
      return { ...responseObj };
    }

    await handleLocation({
      geo: geo,
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
      const { code, geo } = ctx;

      //! cause it only for password ones
      if (!code.password) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      if (!input.password) throw new TRPCError({ code: 'BAD_REQUEST' });

      const success = await verifyPassword(input.password, code.password);
      if (!success)
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Wrong password' });

      await handleLocation({
        geo: geo,
        prisma: ctx.prisma,
        codeId: code.id,
      });

      return { info: code.info, success: success };
    }),
  getSlinkWithSignature: codeProcedure
    .input(schemaForFormPublicKey)
    .mutation(async ({ ctx, input }) => {
      const { code, geo } = ctx;

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

      await handleLocation({
        geo: geo,
        prisma: ctx.prisma,
        codeId: code.id,
      });

      return { info: code.info, success: isVerified };
    }),

  getKeysAndSign: publicProcedure
    .input(z.object({ message: z.string().min(1) }))
    .query(({ input }) => {
      const [publicKey, privateKey] = generateKeys();
      const signature = signMessage(input.message, privateKey);

      return { signature, publicKey, privateKey };
    }),
});
