import QRCode from 'easyqrcodejs-nodejs';
import { z } from 'zod';

export const createQrSchema = z.object({
  text: z.string(),
  width: z.number().gte(1).default(256),
  height: z.number().gte(1).default(256),
  colorDark: z.string().min(4).max(9).regex(/^#/).default('#000000'),
  colorLight: z.string().min(4).max(9).regex(/^#/).default('#ffffff'),
  correctLevel: z.nativeEnum(QRCode.CorrectLevel),
  extra: z
    .object({
      dotScale: z.number().gte(0).lte(1).default(1),
      dotScaleTiming: z.number().gte(0).lte(1).default(1),
      dotScaleA: z.number().gte(0).lte(1).default(1),
      quietZone: z.number().gte(0).lte(1).default(0),
      quietZoneColor: z.string().min(4).max(9).regex(/^#/).default('#ffffff'),
      logo: z.string(),
      logoBackgroundTransparent: z.boolean().default(false),
      logoBackgroundColor: z.string().min(4).max(9).regex(/^#/).default('#ffffff'),
      backgroundImage: z.string(),
      autoColor: z.boolean().default(false),
    })
    .partial()
    .optional(),
});

export type CreateQrSchema = z.infer<typeof createQrSchema>;
