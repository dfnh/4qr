import { Card, CardHeader, CardTitle } from '~/ui/card';

import { CardCreateContent } from './CardCreateContent';

const CardCreate = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Qr code</CardTitle>
      </CardHeader>
      <CardCreateContent />
    </Card>
  );
};

export { CardCreate };
