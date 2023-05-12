import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type UseFormProps } from 'react-hook-form';
import { type ZodType } from 'zod';

export type UseZodFormProps<TSchema extends ZodType> = Omit<
  UseFormProps<TSchema['_input']>,
  'resolver'
> & { schema: TSchema };

const useZodForm = <TSchema extends ZodType>({
  schema,
  ...rest
}: UseZodFormProps<TSchema>) => {
  const form = useForm<TSchema['_input']>({
    ...rest,
    resolver: zodResolver(schema, undefined),
  });

  return form;
};

export { useZodForm };
