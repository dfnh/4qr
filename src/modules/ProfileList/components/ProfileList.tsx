import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { LoadingSpinner2 } from '~/components/Spinner';
import { api } from '~/utils/api';
import ProfileCard from './ProfileCard';

const ProfileListEmpty = dynamic(() => import('./ProfileListEmpty'), { ssr: false });

const ProfileList = () => {
  const router = useRouter();
  const {
    data: codes,
    isLoading,
    isFetching,
  } = api.user.getQrList.useQuery(undefined, {
    refetchOnWindowFocus: true,
  });

  if (isLoading || isFetching) {
    return <LoadingSpinner2 />;
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {codes?.length === 0 && <ProfileListEmpty />}
      {codes?.map((code) => (
        <ProfileCard
          key={code.id}
          code={code}
          link={`${router.asPath}/code/${code.shorturl || ''}`}
        />
      ))}
    </div>
  );
};

export default ProfileList;
