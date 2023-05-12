import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { createQrSchema, type CreateQrSchema } from '~/schemas/createQr';
import { Button } from '~/ui/button';
import { CardContent, CardFooter } from '~/ui/card';
import { api } from '~/utils/api';
import FormCreate from './FormCreate';

import { type QrFullSchema, qrFullSchema } from '~/schemas/QRCodeStyling';
import { useAtom, useSetAtom } from 'jotai';
import { da } from '~/store/atoms';
import { nanoid } from '~/utils/nanoid';
import { getSlinkUrl } from '~/helpers/getBaseUrl';
import { qrCodeAtom } from '~/store/qrAtom';
import { convertToBase64 } from '~/helpers/convertToBase64';
import { useSetKeysAtom, useSetSlinkNewAtom } from '~/store/hooks';
import { useSession } from 'next-auth/react';

const schema = qrFullSchema;
// type ZodFormData = z.infer<typeof schema>;

const CardCreateContent = () => {
  const { status } = useSession();
  const methods = useForm<QrFullSchema>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    shouldFocusError: true,
  });

  // const setQrId = useSetQrIdAtom();
  const setKeys = useSetKeysAtom();
  // const setDisplayQr = useSetDisplayQrIdAtom();

  // const { mutate } = api.qr.createQr.useMutation({
  //   onSuccess(data) {
  //     // const qr = { qrId: data.id };
  //     // setQrId(data.id);
  //     // if (data.privateKey) {
  //     //   // qr.keys = { privateKey: data.privateKey, publicKey: data.publicKey };
  //     //   setKeys({ privateKey: data.privateKey, publicKey: data.publicKey });
  //     // }
  //     // console.log(data);
  //   },
  //   onError(error) {
  //     console.error(error);
  //   },
  // });

  const { mutate: mutateNew } = api.qr.createQrNew.useMutation({
    onSuccess(data) {
      console.log(data);
      if (data.privateKey) {
        console.log(data);

        setKeys({ privateKey: data.privateKey, publicKey: data.publicKey });
      }
    },
    onError(error) {
      console.error(error);
    },
  });

  const setDaAtom = useSetAtom(da);
  const [qrCode, setQrCode] = useAtom(qrCodeAtom);
  const setSlinkAtom = useSetSlinkNewAtom();

  const handleSubmitData = useCallback(
    async (values: QrFullSchema) => {
      if (status === 'authenticated' && values.createCode) {
        console.log(values);

        let slink: string | undefined = undefined; // const link: string | undefined = undefined;
        const initData = values.data;
        if (values.slink) {
          const slinkResult = await generateSlink();
          slink = slinkResult.slink; // link = slinkResult.link;
          values.data = slinkResult.link;

          setSlinkAtom(slink);
        }
        // eslint-disable-next-line
        // @ts-ignore
        qrCode.update(values);
        const blob = await qrCode.getRawData('webp');
        if (!blob) {
          return;
        }
        const image64 = await convertToBase64(blob);

        mutateNew({
          data: initData,
          password: values.password,
          sign: values.sign,
          image64: image64,
          slink: slink,
        });
      }

      // fixme fix types
      // eslint-disable-next-line
      // @ts-ignore
      setDaAtom(values);
      if (!values.slink) {
        setSlinkAtom('');
      }
    },
    [mutateNew, qrCode, setDaAtom, status]
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

const generateSlink = async () => {
  const slink = await nanoid();
  const link = getSlinkUrl(slink);

  return { slink, link };
};

export { CardCreateContent };
