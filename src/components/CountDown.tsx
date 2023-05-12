import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '~/ui/button';

const CountDown = ({ url, disabled = false }: { url: string; disabled?: boolean }) => {
  const [count, setCount] = useState(5);
  const router = useRouter();

  const redirectToUrl = useCallback(() => {
    if (!url) return;
    void router.replace(url);
  }, [router, url]);

  useEffect(() => {
    if (disabled) return;

    const timer =
      count > 0 &&
      setInterval(() => {
        setCount((p) => p - 1);
      }, 1_000);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [count, disabled]);

  useEffect(() => {
    if (count === 0) {
      redirectToUrl();
    }
  }, [count, redirectToUrl]);

  if (disabled) {
    return <Button onClick={redirectToUrl}>Go now</Button>;
  }

  return (
    <>
      <p className="mt-6 leading-7">You will be redirected in {count}</p>
      <Button onClick={redirectToUrl}>Go now</Button>
    </>
  );
};

export { CountDown };
