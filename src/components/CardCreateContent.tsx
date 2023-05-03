import { useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import {
  type CreateQrSchema,
  createQrSchema,
  createRouteSchema,
  type CreateRouteSchema,
} from '~/schemas/createQr';
import { Button } from '~/ui/button';
import { CardContent, CardFooter } from '~/ui/card';
import { api } from '~/utils/api';
import { FormCreate } from './FormCreate';

import { useSetQrIdAtom } from '~/store/hooks';
// import { useCreateQr } from '~/hooks/useCreateQr';

const schema = createQrSchema;
// const schema = createRouteSchema;
// type ZodFormData = z.infer<typeof schema>;

const CardCreateContent = () => {
  const methods = useForm<CreateQrSchema>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  const setQrId = useSetQrIdAtom();

  const { mutate } = api.qr.createQr.useMutation({
    onSuccess(data) {
      setQrId(data.id);
      console.log(data);
    },
    onError(error) {
      console.log(error);
    },
  });

  const submitData = useCallback(
    (d: CreateQrSchema) => {
      mutate(d);
    },
    [mutate]
  );
  return (
    <>
      <FormProvider {...methods}>
        <CardContent className="grid gap-6">
          <FormCreate />
        </CardContent>
        <CardFooter className="">
          <Button
            className="w-full"
            type="submit"
            onClick={methods.handleSubmit(submitData)}
          >
            Submit
          </Button>
        </CardFooter>
      </FormProvider>
    </>
  );
};

export { CardCreateContent };
