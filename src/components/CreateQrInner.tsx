import dynamic from 'next/dynamic';
import { LoadingSpinner2 } from './Spinner';
import { CardCreate } from './CardCreate';
import { useCallback, useRef } from 'react';

const LazyDisplayQr = dynamic(() => import('~/components/DisplayQrNew'), {
  ssr: false,
  loading: () => <LoadingSpinner2 />,
});

const CreateQrInner = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollIntoView = useCallback(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  }, []);

  return (
    <>
      <div ref={scrollRef} className="flex flex-col gap-2 md:order-2 md:w-2/6">
        <LazyDisplayQr />
      </div>
      <div className="md:w-3/6 ">
        <CardCreate scrollIntoView={scrollIntoView} />
      </div>
    </>
  );
};

export default CreateQrInner;
