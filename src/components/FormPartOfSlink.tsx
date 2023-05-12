import { Input } from '~/ui/input';
import { Label } from '~/ui/label';
import { Button } from '~/ui/button';
import { useForm } from 'react-hook-form';
import { ErrorSpan } from '~/components/ErrorSpan';
import {
  schemaForFormPassword,
  type SchemaForFormPassword,
  schemaForFormPublicKey,
  type SchemaForFormPublicKey,
} from '~/schemas/codeProcedure';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSetSlinkAtom } from '~/store/hooks';
import { api } from '~/utils/api';
import { useZodForm } from '~/hooks/useZodForm';
import { Textarea } from '~/ui/textarea';

const FormPartOfSlinkPassword = ({ slink }: { slink: string }) => {
  const {
    register,
    handleSubmit,
    setError,
    resetField,
    formState: { errors },
  } = useZodForm({ schema: schemaForFormPassword, mode: 'onBlur' });

  const setSlinkAtom = useSetSlinkAtom();

  const { mutate } = api.qr.getSlinkWithPass.useMutation({
    onSuccess(data) {
      setSlinkAtom(data);
    },
    onError() {
      resetField('password', { keepDirty: false, keepTouched: false });
      setError('password', { message: 'Wrong password' });
    },
  });

  const onSubmit = (p: SchemaForFormPassword) => {
    mutate({ slink, ...p });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="password">Password</Label>
        <div className="flex w-full items-center space-x-2">
          <Input id="password" type="text" {...register('password')} />
          <Button type="submit" variant="default">
            Send
          </Button>
        </div>
        {errors.password?.message && <ErrorSpan>{errors.password.message}</ErrorSpan>}
      </form>
    </>
  );
};

const FormPartOfSlinkSignature = ({ slink }: { slink: string }) => {
  const {
    handleSubmit,
    register,
    resetField,
    setError,
    formState: { errors },
  } = useZodForm({ schema: schemaForFormPublicKey, mode: 'all' });

  const setSlinkAtom = useSetSlinkAtom();

  const { mutate, isLoading } = api.qr.getSlinkWithSignature.useMutation({
    onSuccess(data) {
      setSlinkAtom(data);
    },
    onError() {
      resetField('publicKey', { keepDirty: false, keepTouched: false });
      setError('publicKey', { message: 'Wrong public key' });
    },
  });

  const onSubmit = (p: SchemaForFormPublicKey) => {
    const qq1 = p.publicKey.replace(/\n/g, '\n');
    const qq = p.publicKey.split('\n');

    console.log(qq);
    mutate({ slink, pubkeyar: qq, publicKey: qq1 });
    // mutate({ slink, publicKey: qq });
    console.log({ p, pub });
    console.log('sad');
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="publicKey">Public key</Label>
        <div className="flex w-full items-center space-x-2">
          <Textarea
            id="publicKey"
            {...register('publicKey', {
              // value: pub
            })}
          />
          <Button type="submit" variant="default" disabled={isLoading}>
            Send
          </Button>
        </div>
        {errors.publicKey?.message && <ErrorSpan>{errors.publicKey.message}</ErrorSpan>}
      </form>
    </>
  );
};

//?????????????????????????????????????????????????????????????????????????????????????????????????
const pub =
  '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtkRxScJbYWZTwsDTEGT3\nTrZ6nOY1Ey2we9WZOiTz4MEZlOqVW1RTuy4Fzzy03hxuUO0KzTRsWa9Rr7yB2gbL\ngmxDEJBAM7fDgwWAeeRxLg9Gjs4JqYpUfxg1nXLylHHNRlot4CDPRPkvH1ntm/Il\nGE4kt+PWUtVNiUMJhVzw8dtH8GpyiNc90v82chuFLwrTwqavFtezOL2Qe778snxr\nFEVPmDbZKkLmT898GtFAc5ip6MdOleCEk9eECHSQJuBruyNfLna7IBwvB3x/zbMg\n+w45TytWcqtVPrx1o2jcvGGVFvt8RLTehe5hbRg6+/QpAFrXAluIwNQ1n/8Bm6Cu\npQIDAQAB\n-----END PUBLIC KEY-----\n';

export { FormPartOfSlinkPassword, FormPartOfSlinkSignature };
