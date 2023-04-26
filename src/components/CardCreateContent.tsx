import { zodResolver } from '@hookform/resolvers/zod';
import { memo, useCallback } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { type CreateQrSchema, createQrSchema } from '~/schemas/createQr';
import { Button } from '~/ui/button';
import { CardContent, CardFooter } from '~/ui/card';
import { Label } from '~/ui/label';
import { Textarea } from '~/ui/textarea';
import { api } from '~/utils/api';

import { useAtom } from 'jotai';
import { qrIdAtom } from '~/store/atoms';

const schema = createQrSchema;
// type ZodFormData = z.infer<typeof schema>;

const CardCreateContent = () => {
  const methods = useForm<CreateQrSchema>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  const [qrId, setQrId] = useAtom(qrIdAtom);

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

const FormCreate = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateQrSchema>();
  // todo add scrollbar
  return (
    <form className="grid gap-2">
      <Label htmlFor="data">Data</Label>
      <Textarea
        id="data"
        className="max-h-[10.5rem] min-h-[10.5rem]"
        placeholder="data for qr code"
        {...register('text')}
      />
      {errors.text?.message && <ErrorSpan>{errors.text.message}</ErrorSpan>}
      {Object.keys(errors).map((e) => (
        <p key={e}>{e}</p>
      ))}
    </form>
  );
};

const _ErrorSpan = ({ children, message }: { children?: string; message?: string }) => {
  return (
    <span role="alert" className="text-red-600">
      {message ?? children}
    </span>
  );
};
export const ErrorSpan = memo(_ErrorSpan);

export { CardCreateContent };
