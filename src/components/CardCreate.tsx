import { Card, CardHeader, CardTitle } from '~/ui/card';

import { CardCreateContent } from './CardCreateContent';

const CardCreate = () => {
  return (
    <Card className="bg-background text-primary">
      <CardHeader>
        <CardTitle>Create Qr code</CardTitle>
      </CardHeader>
      <CardCreateContent />
    </Card>
  );
};

export { CardCreate };
