import { useAtom } from 'jotai';
import Image from 'next/image';
import { qrIdAtom } from '~/store/atoms';
import { Card, CardContent, CardHeader, CardTitle } from '~/ui/card';
import { api } from '~/utils/api';
import { LoadingSpinner } from './Spinner';

const DisplayQr = () => {
  // to display image
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Qr Code</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="">
          <QrThingy />
        </div>
      </CardContent>
    </Card>
  );
};

const QrThingy = () => {
  const [qrId] = useAtom(qrIdAtom);

  const { data, isLoading, isError } = api.qr.getQrById.useQuery(
    { id: qrId },
    {
      enabled: qrId.length !== 0,
      refetchOnWindowFocus: false,
      onError(err) {
        console.error(err);
      },
    }
  );
  return (
    <>
      {isLoading || isError ? (
        <div className="flex aspect-square w-[256px] items-center justify-center">
          <LoadingSpinner size={48} />
        </div>
      ) : (
        <Image src={data?.qrUrl ?? ''} alt="qr code" width={256} height={256} />
      )}
    </>
  );
};

export default DisplayQr;
