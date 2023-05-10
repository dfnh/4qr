import { z } from 'zod';
import { asOptionalField } from '~/helpers/asOptionalField';

const dotsOptionsType = z
  .enum(['dots', 'rounded', 'classy', 'classy-rounded', 'square', 'extra-rounded'])
  .optional()
  .default('square');
const colorSchema = z.string().min(4).max(9).regex(/^#/);

const colorStopsSchema = z
  .tuple([
    z.object({
      offset: z.literal(0).optional().default(0),
      color: colorSchema.optional().default('#000000'),
    }),
    z.object({
      offset: z.literal(1).optional().default(1),
      color: colorSchema.optional().default('#000000'),
    }),
  ])
  .optional();

const gradientSchema = z
  .object({
    type: z.enum(['radial', 'linear']).default('radial'),
    rotation: z.number().default(0),
    colorStops: colorStopsSchema,
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
    .extend({ type: z.enum(['dot', 'square', 'extra-rounded']).optional() }) //.default('square')
    .optional(),
  cornersDotOptions: colorGradientSchema
    .extend({ type: z.enum(['dot', 'square']).optional() }) //.default('square')
    .optional(),
  backgroundOptions: z
    .object({
      color: colorSchema.default('#ffffff'),
      gradient: gradientSchema,
    })
    .optional(),
  shape: z.enum(['square', 'circle']).default('square').optional(),
});

export const qrFullSchema = qrSchema.extend({
  // text: z.string().trim().min(1, 'Field must be not empty'),
  password: asOptionalField(
    z.string().trim().min(2, 'Password must contain at least 2 characters')
  ),
  slink: z.boolean().default(false),
  sign: z.boolean().default(false),
});
export type QrFullSchema = z.infer<typeof qrFullSchema>;
export type QrFullSchemaOut = z.output<typeof qrFullSchema>;

export type QrSchema = z.infer<typeof qrSchema>;

export { qrSchema };
