export type GetTypeOfConst<T extends readonly unknown[]> = T[number];
export type ValueOf<T> = T[keyof T];
