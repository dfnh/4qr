import { useTranslations } from 'next-intl';
import type QrScanner from 'qr-scanner';
import { Button } from '~/ui/button';

type WebCamButtonsProps = {
  cameras: QrScanner.Camera[];
  checkCamFn: () => void;
  active: boolean;
  toggle: () => void;
};

const WebCamButtons = ({ cameras, checkCamFn, active, toggle }: WebCamButtonsProps) => {
  const t = useTranslations('CamPage.WebCamButtons');

  if (cameras.length === 0) {
    return (
      <Button variant="default" onClick={checkCamFn}>
        {t('give access')}
      </Button>
    );
  }

  return (
    <Button variant={active ? 'destructive' : 'start'} className="w-20" onClick={toggle}>
      {active ? t('active.stop') : t('active.start')}
    </Button>
  );
};

export default WebCamButtons;
