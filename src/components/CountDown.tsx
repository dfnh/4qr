import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '~/ui/button';

const CountDown = ({ url }: { url: string }) => {
  const [count, setCount] = useState(5);
  const router = useRouter();

  useEffect(() => {
    const timer =
      count > 0 &&
      setInterval(() => {
        setCount((p) => p - 1);
      }, 1_000);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [count]);

  const redirectToUrl = useCallback(() => {
    if (!url) return;
    void router.replace(url);
  }, [router, url]);

  useEffect(() => {
    if (count === 0) {
      redirectToUrl();
    }
  }, [count, redirectToUrl]);

  return (
    <>
      <p className="mt-6 leading-7">You will be redirected in {count}</p>
      <Button onClick={redirectToUrl}>Go now</Button>
    </>
  );
};

export { CountDown };
