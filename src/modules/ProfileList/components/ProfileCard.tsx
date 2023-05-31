import { Link2Icon } from 'lucide-react';
import Link from 'next/link';
import { CopyButton } from '~/components/CopyButton';
import { TooltipWrapper } from '~/components/TooltipWrapper';
import { handleCopy } from '~/helpers/copyToClipboard';
import { getSlinkUrl } from '~/helpers/getBaseUrl';
import { Card, CardHeader, CardTitle } from '~/ui/card';
import { type RouterOutputs } from '~/utils/api';

type ProfileCardProps = {
  code: RouterOutputs['user']['getQrList'][0];
  link: string;
};

const ProfileCard = ({ code, link }: ProfileCardProps) => {
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

export default ProfileCard;
