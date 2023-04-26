import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/ui/card';
import { Button } from '~/ui/button';
import { Label } from '~/ui/label';
import { Textarea } from '~/ui/textarea';
import React, { memo, useCallback } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

const CardCreate = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Qr code</CardTitle>
      </CardHeader>
      <CardCreateContent />
    </Card>
  );
};

const CardCreateContent = () => {
  const methods = useForm<ZodFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const submitData = useCallback((data: ZodFormData) => {
    console.log(data);
  }, []);
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

export { CardCreate };

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// import { Input } from '~/ui/input';

const schema = z.object({ data: z.string().min(2) });
type ZodFormData = z.infer<typeof schema>;

const FormCreate = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ZodFormData>();
  // todo add scrollbar
  return (
    <form className="grid gap-2">
      <Label htmlFor="data">Data</Label>
      <Textarea
        id="data"
        className="max-h-[10.5rem] min-h-[10.5rem]"
        placeholder="data for qr code"
        {...register('data')}
      />
      {errors.data?.message && <ErrorSpan>{errors.data.message}</ErrorSpan>}
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
