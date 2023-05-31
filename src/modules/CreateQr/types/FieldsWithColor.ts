import { type GetTypeOfConst } from '~/typescript';

export const fieldsWithColor = [
  'dotsOptions',
  'cornersDotOptions',
  'cornersSquareOptions',
  'backgroundOptions',
] as const;
export type FieldsWithColor = GetTypeOfConst<typeof fieldsWithColor>;
