import { Card, CardHeader, CardTitle } from '~/ui/card';
import { CardCreateContent } from './CardCreateContent';
import { useTranslations } from 'next-intl';

const CardCreate = ({ scrollIntoView }: { scrollIntoView?: () => void }) => {
  const t = useTranslations('CreateQrPage.CardCreate');

  return (
    <Card className="border-ring bg-slate-500/5 text-foreground dark:bg-foreground/5">
      <CardHeader>
        <CardTitle>{t('CardTitle')}</CardTitle>
      </CardHeader>
      <CardCreateContent scrollIntoView={scrollIntoView} />
    </Card>
  );
};

export { CardCreate };
