import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { createQrSchema, type CreateQrSchema } from '~/schemas/createQr';
import { Button } from '~/ui/button';
import { CardContent, CardFooter } from '~/ui/card';
import { api } from '~/utils/api';
import { FormCreate } from './FormCreate';

import { useSetDisplayQrIdAtom, useSetKeysAtom, useSetQrIdAtom } from '~/store/hooks';

const schema = createQrSchema;
// type ZodFormData = z.infer<typeof schema>;

const CardCreateContent = () => {
  const methods = useForm<CreateQrSchema>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  const setQrId = useSetQrIdAtom();
  const setKeys = useSetKeysAtom();
  // const setDisplayQr = useSetDisplayQrIdAtom();

  const { mutate } = api.qr.createQr.useMutation({
    onSuccess(data) {
      // const qr = { qrId: data.id };
      setQrId(data.id);
      if (data.privateKey) {
        // qr.keys = { privateKey: data.privateKey, publicKey: data.publicKey };
        setKeys({ privateKey: data.privateKey, publicKey: data.publicKey });
      }
      console.log(data);
    },
    onError(error) {
      console.error(error);
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
