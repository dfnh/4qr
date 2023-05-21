import { z } from 'zod';
import { asOptionalField } from '~/helpers/asOptionalField';
import { toUtf8 } from '~/helpers/toUtf8';

const dotsOptionsType = z
  .enum(['dots', 'rounded', 'classy', 'classy-rounded', 'square', 'extra-rounded'])
  .optional()
  .default('square');
const colorSchema = z.string().min(4).max(9).regex(/^#/);

const colorStopsSchema = z
  .tuple([
    z
      .object({ color: colorSchema.optional().default('#000000') })
      .transform((data) => ({ ...data, offset: 0 })),
    z
      .object({ color: colorSchema.optional().default('#000000') })
      .transform((data) => ({ ...data, offset: 1 })),
  ])
  .optional();
// offset: z.literal(1).optional().default(1),

const gradientSchema = z
  .object({
    type: z.enum(['radial', 'linear']).default('radial'),
    colorStops: colorStopsSchema,
    rotation: z
      .number()
      .min(0)
      .default(0)
      .transform((deg) => deg * (Math.PI / 180)),
  })
  .optional();
const colorGradientSchema = z.object({
  color: colorSchema.default('#000000').optional(),
  gradient: gradientSchema,
});
// const check = z.object({
//   z: z.nativeEnum(drawTypes),
// });

const qrSchema = z.object({
  width: z.number().min(0).default(300),
  height: z.number().min(0).default(300),
  type: z.enum(['canvas', 'svg']).optional().default('canvas'),
  data: z.string().trim().min(1, 'Field must be not empty'),
  image: z.string().optional(),
  margin: z.number().default(0).optional(),
  qrOptions: z
    .object({
      typeNumber: z.number().min(0).max(40).default(0),
      mode: z.enum(['Numeric', 'Alphanumeric', 'Byte', 'Kanji']).optional(),
      errorCorrectionLevel: z.enum(['L', 'M', 'Q', 'H']).optional().default('Q'),
    })
    .optional(),
  imageOptions: z
    .object({
      hideBackgroundDots: z.boolean().optional().default(true),
      imageSize: z.number().min(0).max(1).optional().default(0.4),
      margin: z.number().min(0).optional().default(0),
      crossOrigin: z
        .enum(['anonymous', 'use-credentials'])
        .optional()
        .default('anonymous'),
    })
    .optional(),
  dotsOptions: colorGradientSchema.extend({ type: dotsOptionsType }).optional(),
  cornersSquareOptions: colorGradientSchema
    .extend({ type: z.enum(['dot', 'square', 'extra-rounded']).optional() })
    .optional(),
  cornersDotOptions: colorGradientSchema
    .extend({ type: z.enum(['dot', 'square']).optional() })
    .optional(),
  backgroundOptions: z
    .object({
      color: colorSchema.default('#ffffff'),
      gradient: gradientSchema,
    })
    .optional(),
  shape: z.enum(['square', 'circle']).default('square').optional(),
});

const strictlyBusiness = z.object({
  password: asOptionalField(
    z.string().trim().min(2, 'Password must contain at least 2 characters')
  ),
  slink: z.boolean().default(false),
  sign: z.boolean().default(false),
});

export const qrFullSchema = qrSchema.merge(strictlyBusiness).transform((d) => ({
  ...d,
  createCode: d.slink || d.sign || !!d.password,
  utf8: toUtf8(d.data),
}));

export type QrFullSchema = z.infer<typeof qrFullSchema>;
export type QrFullSchemaOut = z.output<typeof qrFullSchema>;

export type QrSchema = z.infer<typeof qrSchema>;

export { qrSchema };
