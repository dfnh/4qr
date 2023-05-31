import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '~/ui/card';
import DisplayQrCode from './DisplayQrCode';

const DisplayQr = () => {
  const t = useTranslations('CreateQrPage.DisplayQrCode');

  return (
    <Card className="top-0 border-ring bg-slate-500/5 text-foreground dark:bg-foreground/5 md:sticky">
      <CardHeader>
        <CardTitle>{t('Your qr code')}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center px-2">
        <div className="flex flex-col items-center gap-2">
          <DisplayQrCode />
        </div>
      </CardContent>
    </Card>
  );
};

export default DisplayQr;
