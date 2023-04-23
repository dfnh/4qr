import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/ui/card';
import { Button } from '~/ui/button';
import { Label } from '~/ui/label';
import { Textarea } from '~/ui/textarea';

// fixme form="FormCreate"
const CardCreate = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Qr code</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <FormCreate />
      </CardContent>
      <CardFooter className="">
        <Button className="w-full" form="FormCreate" type="submit">
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
};

export { CardCreate };

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { memo, useCallback } from 'react';

const schema = z.object({ data: z.string().min(2) });
type ZodFormData = z.infer<typeof schema>;

// fixme use form context instead of hardcoding
const FormCreate = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ZodFormData>({ resolver: zodResolver(schema) });

  const submitData = useCallback((data: ZodFormData) => {
    console.log(data);
  }, []);
  return (
    <form className="grid gap-2" id="FormCreate" onSubmit={handleSubmit(submitData)}>
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
