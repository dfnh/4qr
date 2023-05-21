import { Card, CardHeader, CardTitle } from '~/ui/card';

import { CardCreateContent } from './CardCreateContent';

const CardCreate = ({ scrollIntoView }: { scrollIntoView?: () => void }) => {
  return (
    <Card className="border-ring bg-slate-500/5 text-foreground dark:bg-foreground/5">
      <CardHeader>
        <CardTitle>Create qr code</CardTitle>
      </CardHeader>
      <CardCreateContent scrollIntoView={scrollIntoView} />
    </Card>
  );
};

export { CardCreate };
