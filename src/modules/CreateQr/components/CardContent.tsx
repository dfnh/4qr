import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom, useSetAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { convertToBase64 } from '~/helpers/convertToBase64';
import { qrFullSchema, type QrFullSchema } from '~/schemas/QRCodeStyling';
import { da } from '~/store/atoms';
import { useSetKeysAtom, useSetSlinkNewAtom } from '~/store/hooks';
import { qrCodeAtom } from '~/store/qrAtom';
import { Button } from '~/ui/button';
import { CardContent as CC, CardFooter } from '~/ui/card';
import { api } from '~/utils/api';
import { generateSlink } from '../helpers/generateSlink';
import CreateForm from './CreateForm';

const schema = qrFullSchema;

const CardContent = ({ scrollIntoView }: { scrollIntoView?: () => void }) => {
  const t = useTranslations('CreateQrPage.CardCreate');
  const { status } = useSession();
  const methods = useForm<QrFullSchema>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    shouldFocusError: true,
  });

  // const setQrId = useSetQrIdAtom();
  const setKeys = useSetKeysAtom();
  // const setDisplayQr = useSetDisplayQrIdAtom();

  const { mutate: mutateNew } = api.qr.createQrNew.useMutation({
    onSuccess(data) {
      setKeys({ privateKey: data.privateKey, publicKey: data.publicKey });
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
      scrollIntoView?.();

      if (status === 'authenticated' && values.createCode) {
        const initData = values.data;

        const slinkResult = await generateSlink();
        const slink = slinkResult.slink;
        values.data = slinkResult.link;
        setSlinkAtom(slink);

        // eslint-disable-next-line
        // @ts-ignore
        qrCode.update({ ...values });

        const blob = await qrCode.getRawData('webp');
        if (!blob) return;
        const image64 = await convertToBase64(blob);

        mutateNew({
          data: initData,
          password: values.password,
          sign: values.sign,
          image64: image64,
          slink: slink,
        });
        return;
      }

      // fixme fix types
      // eslint-disable-next-line
      // @ts-ignore
      setDaAtom({ ...values, data: values.utf8 });
      setSlinkAtom('');
    },
    [mutateNew, qrCode, scrollIntoView, setDaAtom, setSlinkAtom, status]
    // [mutate]
  );

  const handlePreviewData = useCallback(() => {
    const values = methods.getValues();
    values.data = 'preview data';
    const parsed = schema.safeParse(values);
    if (!parsed?.success) return;
    parsed.data.data = parsed.data.utf8;

    // eslint-disable-next-line
    // @ts-ignore
    setDaAtom(parsed.data);
    scrollIntoView?.();
  }, [methods, scrollIntoView, setDaAtom]);

  return (
    <>
      <FormProvider {...methods}>
        <CC className="grid gap-6">
          <CreateForm />
        </CC>
        <CardFooter className="">
          <span className="flex w-full space-x-2">
            <Button
              className="w-full"
              type="submit"
              onClick={methods.handleSubmit(handleSubmitData)}
            >
              {t('Submit')}
            </Button>
            <Button type="button" onClick={handlePreviewData}>
              {t('Preview')}
            </Button>
          </span>
        </CardFooter>
      </FormProvider>
    </>
  );
};

export default CardContent;
