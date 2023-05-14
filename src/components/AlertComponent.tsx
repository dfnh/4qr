import { Alert, AlertDescription, AlertTitle, type AlertVariants } from '~/ui/alert';

const AlertComponent = ({
  title,
  description,
  variant,
}: { title?: string; description?: string } & AlertVariants) => {
  return (
    <Alert variant={variant ?? 'destructive'}>
      <AlertTitle className="font-semibold">{title ?? 'Error'}</AlertTitle>
      <AlertDescription className="text-sm leading-tight tracking-tight">
        {description}
      </AlertDescription>
    </Alert>
  );
};

export default AlertComponent;
