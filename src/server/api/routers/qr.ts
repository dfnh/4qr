import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

import { hashPassword, verifyPassword } from '~/helpers/bcrypt';
import { getBaseUrl, getSlinkUrl } from '~/helpers/getBaseUrl';
import { createQrBusinessPartSchema, createQrSchema } from '~/schemas/createQr';
import { nanoid } from '~/utils/nanoid';
import { handleLocation } from '../helpers/locationLogic';
import { codeProcedure } from '../procedures/codeProcedure';

import { asOptionalField } from '~/helpers/asOptionalField';
import { generateKeys, signMessage, verifyMessageSignature } from '~/helpers/crypto';
import { generateQR } from '~/helpers/generateQr';
import { schemaForFormPassword, schemaForFormPublicKey } from '~/schemas/codeProcedure';

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

        console.log({ publicKey, privateKey });

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

    console.log(code);

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
      if (!input.password)
        // return { qrUrl: code.image, slink: code.shorturl, isUrl, success: false };
        return { ...responseObj };

      const success = await verifyPassword(input.password, code.password);
      // if (!success) return { qrUrl: code.image, slink: code.shorturl, isUrl, success };
      if (!success) return { ...responseObj };
    }

    if (!!code.signature) {
      // return { qrUrl: code.image, slink: code.shorturl, isUrl, success: false };
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

      // console.log({ info: code.info, qrUrl: code.image, isUrl, success });
      return { info: code.info, qrUrl: code.image, isUrl, success: success };
    }),
  getSlinkWithSignature: codeProcedure
    // .input(z.object({}))
    .input(schemaForFormPublicKey.extend({ pubkeyar: z.string().array().optional() }))
    .mutation(async ({ ctx, input }) => {
      const { code, isUrl } = ctx;

      if (!code.signature || !code.image)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      if (!input.publicKey) throw new TRPCError({ code: 'BAD_REQUEST' });

      // const pub =
      //   '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtkRxScJbYWZTwsDTEGT3\nTrZ6nOY1Ey2we9WZOiTz4MEZlOqVW1RTuy4Fzzy03hxuUO0KzTRsWa9Rr7yB2gbL\ngmxDEJBAM7fDgwWAeeRxLg9Gjs4JqYpUfxg1nXLylHHNRlot4CDPRPkvH1ntm/Il\nGE4kt+PWUtVNiUMJhVzw8dtH8GpyiNc90v82chuFLwrTwqavFtezOL2Qe778snxr\nFEVPmDbZKkLmT898GtFAc5ip6MdOleCEk9eECHSQJuBruyNfLna7IBwvB3x/zbMg\n+w45TytWcqtVPrx1o2jcvGGVFvt8RLTehe5hbRg6+/QpAFrXAluIwNQ1n/8Bm6Cu\npQIDAQAB\n-----END PUBLIC KEY-----\n';

      const message = `${code.info}${code.image}`;

      console.log({ input });

      // const isVerified = verifyMessageSignature(message, pub, code.signature);
      // const isVerified = verifyMessageSignature(message, input.pubkeyar, code.signature);
      const isVerified = verifyMessageSignature(message, input.publicKey, code.signature);
      if (!isVerified) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Wrong key' });

      const stat = await handleLocation({
        ip: ctx.ip,
        prisma: ctx.prisma,
        codeId: code.id,
      });

      console.log({ info: code.info, qrUrl: code.image, isUrl, success: isVerified });

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
