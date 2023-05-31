import { useTranslations } from 'next-intl';
import { Card, CardHeader, CardTitle } from '~/ui/card';
import CardContent from './CardContent';

const CardCreate = ({ scrollIntoView }: { scrollIntoView?: () => void }) => {
  const t = useTranslations('CreateQrPage.CardCreate');

  return (
    <Card className="border-ring bg-slate-500/5 text-foreground dark:bg-foreground/5">
      <CardHeader>
        <CardTitle>{t('CardTitle')}</CardTitle>
      </CardHeader>
      <CardContent scrollIntoView={scrollIntoView} />
    </Card>
  );
};

export default CardCreate;
