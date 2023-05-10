import dynamic from 'next/dynamic';
import { LoadingSpinner2 } from './Spinner';
import { CardCreate } from './CardCreate';

const LazyDisplayQr = dynamic(() => import('~/components/DisplayQrNew'), {
  ssr: false,
  loading: () => <LoadingSpinner2 />,
});

const CreateQrInner = () => {
  return (
    <>
      <div className="md:order-2 md:w-2/6">
        <LazyDisplayQr />
        {/* <DisplayQr /> */}
      </div>
      <div className="md:w-3/6 ">
        <CardCreate />
      </div>
    </>
  );
};

export default CreateQrInner;
