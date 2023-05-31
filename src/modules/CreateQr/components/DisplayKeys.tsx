import { useTranslations } from 'next-intl';
import { CopyButton } from '~/components/CopyButton';
import HoverCardWrapper from '~/components/HoverCardWrapper';
import { Info } from '~/components/icons';
import { copyToClipboard } from '~/helpers/copyToClipboard';
import { exportJson } from '~/helpers/exportJson';
import { useKeysAtomValue, useSlinkNewAtomValue } from '~/store/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '~/ui/card';
import { Label } from '~/ui/label';

const DisplayKeys = () => {
  const t = useTranslations('CreateQrPage.DisplayQrCode.DisplayKeys');
  const keysAtom = useKeysAtomValue();
  const slink = useSlinkNewAtomValue();

  if (!keysAtom?.privateKey || !keysAtom.publicKey || !slink.trim()) {
    return null;
  }

  const handleCopy = (value: string) => {
    return () => {
      copyToClipboard(value);
    };
  };

  return (
    <Card className="w-full border-inherit bg-inherit text-inherit ">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2">
          {t('Your keys')}
          <HoverCardWrapper
            className="text-sm"
            openDelay={300}
            hoverCardText={t('displayKeysHoverCardText')}
          >
            <Info />
          </HoverCardWrapper>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-2 px-2">
        <div className="flex items-center gap-2">
          <Label>{t('Public key')}: </Label>
          <Label>***</Label>
          <CopyButton onClick={handleCopy(keysAtom.publicKey)} />
        </div>
        <div className="flex items-center gap-2">
          <Label>{t('Private key')}: </Label>
          <Label>***</Label>
          <CopyButton onClick={handleCopy(keysAtom.privateKey)} />
        </div>
        <a
          type="button"
          href={exportJson(keysAtom)}
          download={`key-pair-${slink}.json`}
          className="hover:animate-hue-rotation hover:text-emerald-500 dark:hover:text-emerald-200"
        >
          {t('Download Json')}
        </a>
      </CardContent>
    </Card>
  );
};

export default DisplayKeys;
