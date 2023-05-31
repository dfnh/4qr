import { useCallback, useRef } from 'react';
import CardCreate from './CreateCard';
import DisplayQr from './DisplayQr';

const CreateQr = () => {
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
        <DisplayQr />
      </div>
      <div className="md:w-3/6 ">
        <CardCreate scrollIntoView={scrollIntoView} />
      </div>
    </>
  );
};

export default CreateQr;
