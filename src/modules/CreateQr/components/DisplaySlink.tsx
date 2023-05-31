import { CopyButton } from '~/components/CopyButton';
import { handleCopy } from '~/helpers/copyToClipboard';
import { getSlinkUrl } from '~/helpers/getBaseUrl';
import { useSlinkNewAtomValue } from '~/store/hooks';

const DisplaySlink = () => {
  const slink = useSlinkNewAtomValue();

  if (slink == '') return null;

  return (
    <p className="text-sm tracking-tight">
      <span className="flex gap-1">
        slink: {slink}
        <CopyButton iconClassName="w-3.5" onClick={handleCopy(getSlinkUrl(slink))} />
      </span>
    </p>
  );
};

export default DisplaySlink;
