import { Link2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { handleCopy } from '~/helpers/copyToClipboard';
import { getSlinkUrl } from '~/helpers/getBaseUrl';
import { Card, CardHeader, CardTitle } from '~/ui/card';
import { api, type RouterOutputs } from '~/utils/api';
import { CopyButton } from './CopyButton';
import { LoadingSpinner2 } from './Spinner';
import { TooltipWrapper } from './TooltipWrapper';

const ProfileQrList = () => {
  const router = useRouter();
  const { data: codes, isSuccess } = api.user.getQrList.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  if (!isSuccess) {
    return <LoadingSpinner2 />;
  }

  return (
    <>
      {codes?.length === 0 && (
        <div>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            you haven&apos;t created any QR codes yet.{' '}
          </h4>
          <Link
            href="/create"
            className="scroll-m-20 text-xl font-semibold tracking-tight"
          >
            To create new Qr code go to{' '}
            <span className="hover:animate-hue-rotation hover:text-emerald-500 dark:hover:text-emerald-200">
              /create
            </span>
          </Link>
        </div>
      )}
      {codes?.map((code) => (
        <CardForProfileToDisplaySmallCodeInfo
          key={code.id}
          code={code}
          link={`${router.asPath}/code/${code.shorturl || ''}`}
        />
      ))}
    </>
  );
};

type CardForProfileProps = {
  code: RouterOutputs['user']['getQrList'][0];
  link: string;
};

// todo move and rename and fix ur life and find a job and grow up and move on
const CardForProfileToDisplaySmallCodeInfo = ({ code, link }: CardForProfileProps) => {
  return (
    <Card className="w-full bg-background text-foreground">
      <CardHeader className="">
        <div className="relative flex">
          <CardTitle className="flex items-center gap-2">
            {`/s/${code.shorturl ?? ''}`}
            <CopyButton
              className="rounded border transition-all ease-out active:border-emerald-500 active:duration-500"
              onClick={handleCopy(getSlinkUrl(code.shorturl ?? ''))}
            />
          </CardTitle>
          <span className="absolute right-0 hover:animate-hue-rotation hover:text-emerald-500 dark:hover:text-emerald-200 ">
            <Link href={`${link}`}>
              <Link2Icon size={22} />
            </Link>
          </span>
        </div>
        <TooltipWrapper TooltipText={code.info}>
          <p className="truncate text-ellipsis text-sm text-muted-foreground">
            {code.info}
          </p>
        </TooltipWrapper>
      </CardHeader>
    </Card>
  );
};

export default ProfileQrList;
