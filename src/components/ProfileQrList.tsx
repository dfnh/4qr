import { Card, CardHeader, CardTitle } from '~/ui/card';
import { api, type RouterOutputs } from '~/utils/api';
import { TooltipWrapper } from './TooltipWrapper';
import { Link2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LoadingSpinner2 } from './Spinner';

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
      {codes?.map((code) => {
        return (
          <CardForProfileToDisplaySmallCodeInfo
            key={code.id}
            code={code}
            link={`${router.asPath}/code/${code.shorturl || ''}`}
          />
        );
      })}
    </>
  );
};

type CodeOutput = RouterOutputs['user']['getQrList'][0];

// todo move and rename
const CardForProfileToDisplaySmallCodeInfo = ({
  code,
  link,
}: {
  code: CodeOutput;
  link: string;
}) => {
  return (
    <Card className="w-full bg-background text-foreground ">
      <CardHeader className="">
        <div className="relative flex">
          <CardTitle>{`/s/${code.shorturl ?? ''}`} </CardTitle>
          <span className="absolute right-0 hover:animate-hue-rotation hover:text-emerald-500 dark:hover:text-emerald-200  ">
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
