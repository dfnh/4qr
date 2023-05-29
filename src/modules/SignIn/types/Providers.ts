import { type BuiltInProviderType } from 'next-auth/providers';
import { type ClientSafeProvider, type LiteralUnion } from 'next-auth/react';

export type Providers =
  | Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
  | never[];
