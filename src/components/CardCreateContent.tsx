import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { createQrSchema, type CreateQrSchema } from '~/schemas/createQr';
import { Button } from '~/ui/button';
import { CardContent, CardFooter } from '~/ui/card';
import { api } from '~/utils/api';
import { FormCreate } from './FormCreate';

// import { useSetDisplayQrIdAtom, useSetKeysAtom, useSetQrIdAtom } from '~/store/hooks';

import { type QrFullSchema, qrFullSchema } from '~/schemas/QRCodeStyling';
import { useSetAtom } from 'jotai';
import { da } from '~/store/atoms';

// const schema = createQrSchema;
const schema = qrFullSchema;
// type ZodFormData = z.infer<typeof schema>;

const CardCreateContent = () => {
  const methods = useForm<QrFullSchema>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    shouldFocusError: true,
  });

  // const setQrId = useSetQrIdAtom();
  // const setKeys = useSetKeysAtom();
  // const setDisplayQr = useSetDisplayQrIdAtom();

  const { mutate } = api.qr.createQr.useMutation({
    onSuccess(data) {
      // const qr = { qrId: data.id };
      // setQrId(data.id);
      // if (data.privateKey) {
      //   // qr.keys = { privateKey: data.privateKey, publicKey: data.publicKey };
      //   setKeys({ privateKey: data.privateKey, publicKey: data.publicKey });
      // }
      // console.log(data);
    },
    onError(error) {
      console.error(error);
    },
  });

  const setDaAtom = useSetAtom(da);

  const handleSubmitData = useCallback(
    (d: QrFullSchema) => {
      // mutate(d);
      console.log(d);
      // fixme fix types
      // eslint-disable-next-line
      // @ts-ignore
      setDaAtom(d);
    },
    [setDaAtom]
    // [mutate]
  );

  const handlePreviewData = useCallback(() => {
    const values = methods.getValues();
    values.data = 'preview data';
    const parsed = schema.safeParse(values);
    if (!parsed?.success) return;
    console.log(parsed.data);
    // eslint-disable-next-line
    // @ts-ignore
    setDaAtom(parsed.data);
  }, [methods, setDaAtom]);

  return (
    <>
      <FormProvider {...methods}>
        <CardContent className="grid gap-6">
          <FormCreate />
        </CardContent>
        <CardFooter className="">
          <span className="flex w-full space-x-2">
            <Button
              className="w-full"
              type="submit"
              onClick={methods.handleSubmit(handleSubmitData)}
            >
              Submit
            </Button>
            <Button type="button" onClick={handlePreviewData}>
              Preview
            </Button>
          </span>
        </CardFooter>
      </FormProvider>
    </>
  );
};

export { CardCreateContent };
