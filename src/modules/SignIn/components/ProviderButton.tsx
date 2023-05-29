import { type ClientSafeProvider } from 'next-auth/react';
import Image from 'next/image';
import { memo } from 'react';
import { Button } from '~/ui/button';

type ProviderButtonProps = {
  provider: ClientSafeProvider;
  onClick: () => void;
  title: string;
  disabled?: boolean;
};

const ProviderButton = memo(
  ({ provider, onClick, title, disabled = false }: ProviderButtonProps) => {
    return (
      <Button
        variant="secondary"
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="flex h-11 w-full justify-center gap-4"
      >
        <Image
          loading="lazy"
          width={24}
          height={24}
          className=""
          alt={provider.id}
          src={`https://authjs.dev/img/providers/${provider.name.toLowerCase()}.svg`}
        />
        {title}
      </Button>
    );
  }
);
ProviderButton.displayName = 'ProviderButton';

export default ProviderButton;
