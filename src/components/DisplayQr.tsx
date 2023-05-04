import Image from 'next/image';
import { useReadQrIdAtom } from '~/store/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '~/ui/card';
import { api } from '~/utils/api';
import { LoadingSpinner } from './Spinner';
import { env } from '~/env.mjs';
import { Button } from '~/ui/button';

// to display image
const DisplayQr = () => {
  return (
    <Card className="border-ring bg-slate-500/5 text-foreground dark:bg-foreground/5">
      <CardHeader>
        <CardTitle>Your qr code</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <QrThingy />
        </div>
      </CardContent>
    </Card>
  );
};

const initialQrCode = {
  qrUrl:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQUAAAEFCAYAAADqlvKRAAAABmJLR0QA/wD/AP+gvaeTAAAFSklEQVR4nO3dwW7bOhBAUbvw//9yur6bPj6UYYfKOetAlmXlgosB+X69Xl+vH+rr67+/+vv9PnadFSc/a8XK/dzo5DOc5te/vgFgFlEAQhSAEAUgRAEIUQBCFIAQBSA+K39044DKjcMnJ4epVpx8hieHxHY9n6f+X1gpACEKQIgCEKIAhCgAIQpAiAIQogDE0vDSCrv9/L0bh4V2eepA0Y3/F1YKQIgCEKIAhCgAIQpAiAIQogCEKACxbXjpqaYNw0zbfWjFtPvhz6wUgBAFIEQBCFEAQhSAEAUgRAEIUQDC8NIGNx5Rd/KYthU37lD0VFYKQIgCEKIAhCgAIQpAiAIQogCEKACxbXjpqQMhN+4atGvo6OSA065nOG2QbNq7scJKAQhRAEIUgBAFIEQBCFEAQhSAEAUgloaXpg2E3OjGQaCT93PjkNhT/y+sFIAQBSBEAQhRAEIUgBAFIEQBCFEA4v01bSJkmF0DKj95EMiRcHexUgBCFIAQBSBEAQhRAEIUgBAFIEQBiG3Hxk0bUJk2wLNi1/da8dRBqRXT3tUVJ+/ZSgEIUQBCFIAQBSBEAQhRAEIUgBAFID7Thk+eOjCzy8lhmJMDM9OGqU5eZ5dd92OlAIQoACEKQIgCEKIAhCgAIQpAiAIQn2nDQjcOjUzz1Gc4bWjtxue8cj9WCkCIAhCiAIQoACEKQIgCEKIAhCgA8X69XlumPaYNQa3YNTRyckBl2jFkP/n3mva777pnKwUgRAEIUQBCFIAQBSBEAQhRAEIUgFgaXrpxYOYn7xY17bN2mXYk3C7TdriyUgBCFIAQBSBEAQhRAEIUgBAFIEQBiPfXpimNGwdLbhwWOumpw127TBsS2/VZVgpAiAIQogCEKAAhCkCIAhCiAIQoAHF056UV04agpg3MrJj2fKZdZ8XJd34aKwUgRAEIUQBCFIAQBSBEAQhRAEIUgPjsutDJIZ9px36tmLbr1FOfz42mDYBZKQAhCkCIAhCiAIQoACEKQIgCEKIAxLbhpRUnjyGbtgPPtIGrG48zW3Hyfm484nDlOlYKQIgCEKIAhCgAIQpAiAIQogCEKACxbXjpJ+8sNG3nnBt3KDr5e037LaYNOFkpACEKQIgCEKIAhCgAIQpAiAIQogDE0WPjpu2KM81Th2pWTLufXU6+87uej5UCEKIAhCgAIQpAiAIQogCEKAAhCkAc3Xnp5HWmuXEHnqcOFN3o5HO2UgBCFIAQBSBEAQhRAEIUgBAFIEQBiG3DSyum7YZ04w5FK248Wm7a4NaNn2XnJeBbiAIQogCEKAAhCkCIAhCiAIQoAPE5OXgzbcjnqaYdQzbNtOPwVpwcSLNSAEIUgBAFIEQBCFEAQhSAEAUgRAGIz7QdeE5aGQg5eRzert11pu0I9NTPmnZUop2XgG8hCkCIAhCiAIQoACEKQIgCEKIAxNKxcTfuwPPUoaxp32vXMNWN32uXk0NrK9exUgBCFIAQBSBEAQhRAEIUgBAFIEQBiKXhpRUnh0+eOliyy67nc+PxczcOSq04+R5aKQAhCkCIAhCiAIQoACEKQIgCEKIAxLbhJf7s5M45K6Z91oqTx/ytmLZj0go7LwH/mygAIQpAiAIQogCEKAAhCkCIAhCGlzbYNXwybVjopGm7V62YNpjk2DjgW4gCEKIAhCgAIQpAiAIQogCEKACxbXjp5I43J904VDPNje/Gjfe8i5UCEKIAhCgAIQpAiAIQogCEKAAhCkAsDS8Zzvl7J5/hyYGrad9rxbT3+eSxeiusFIAQBSBEAQhRAEIUgBAFIEQBCFEA4jfm2A88piuKxQAAAABJRU5ErkJggg==',
  url: `https://${env.NEXT_PUBLIC_SITE_DOMAIN ?? 'localhost:3000'}`,
};

const QrThingy = () => {
  const [qrId] = useReadQrIdAtom();
  // const [displayQr] = useReadKeysAtom();

  const { data, isLoading, isFetching, isError } = api.qr.getQrById.useQuery(
    { id: qrId },
    {
      enabled: qrId.length !== 0,
      refetchOnWindowFocus: false,
      onError(err) {
        console.error(err);
      },
      initialData: initialQrCode,
    }
  );

  if (isLoading || isFetching || isError) {
    return (
      <div className="flex aspect-square w-[256px] items-center justify-center">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  return (
    <>
      <Image
        src={data.qrUrl ?? ''}
        alt="qr code"
        className="max-h-[200px] min-h-[150px] w-11/12 min-w-[150px] max-w-[200px] shrink  bg-slate-50 p-1"
        width={256}
        height={256}
      />
      {!!data.url && (
        <div className="flex">
          <Button
            onClick={() => {
              navigator.clipboard
                .writeText(data.url ?? '')
                .then(() => console.log('copied to clipboard'))
                .catch((error) => console.error(error));
            }}
            variant={'outline'}
          >
            slink
          </Button>
          {}
        </div>
      )}
    </>
  );
};

export { DisplayQr };
