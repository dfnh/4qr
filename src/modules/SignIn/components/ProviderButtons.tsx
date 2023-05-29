import { signIn, type ClientSafeProvider } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { memo, useCallback, useMemo } from 'react';
import { useSignInLoadingAtom } from '~/store/auth';
import { type Providers, type SignInCommonProps } from '../types';
import ProviderButton from './ProviderButton';

type ProviderButtonsProps = { providers: Providers } & SignInCommonProps;

const ProviderButtons = memo(({ providers, callbackUrl }: ProviderButtonsProps) => {
  const t = useTranslations('SignInPage.SignIn.ProviderButton');
  const providersArray = useMemo(() => {
    return Object.values(providers).filter((p) => p.type === 'oauth');
  }, [providers]);
  const [loading, setLoading] = useSignInLoadingAtom();

  const onClick = useCallback(
    (p: ClientSafeProvider) => {
      // setLoading(true);
      //todo huh??
      void signIn(p.id, {
        callbackUrl: `${callbackUrl ?? window.location.origin}`,
      });
    },
    [callbackUrl]
    // [callbackUrl, setLoading]
  );
  const handleClick = useCallback(
    (p: ClientSafeProvider) => {
      return () => onClick(p);
    },
    [onClick]
  );

  return (
    <div className="container flex flex-col items-center gap-2">
      {providersArray.map((p) => (
        <ProviderButton
          key={p.id}
          provider={p}
          disabled={loading}
          onClick={handleClick(p)}
          title={t('Sign in with', { name: p.name })}
        />
      ))}
    </div>
  );
});
ProviderButtons.displayName = 'ProviderButtons';

export default ProviderButtons;
