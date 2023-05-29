import {
  type GetStaticPropsContext,
  type GetStaticPaths,
  type InferGetStaticPropsType,
} from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { ssgHelper } from '~/server/api/helpers/ssgHelper';

// import SlinkInner from '~/components/SlinkInner';
const SlinkInner = dynamic(() => import('~/components/SlinkInner')); //????

type SSlinkPageProps = InferGetStaticPropsType<typeof getStaticProps>;
const SSlinkPage = ({ slink }: SSlinkPageProps) => {
  return (
    <>
      <Head>
        <title>Slink</title>
      </Head>
      <div>
        <div className="relative flex flex-col items-center justify-center">
          <SlinkInner slink={slink} />
        </div>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: 'blocking' };
};

export const getStaticProps = async (
  context: GetStaticPropsContext<{ slink: string }>
) => {
  const slink = context.params?.slink;
  const locale = context.locale ? `/${context.locale}` : '';

  if (slink == null) {
    return {
      redirect: { destination: `${locale}/`, permanent: false },
    };
  }
  const ssg = ssgHelper();
  await ssg.qr.getById.prefetch({ slink: slink });

  const messages = await (await import('~/utils/nextIntl')).default(context);
  return {
    props: {
      trpcState: ssg.dehydrate(),
      slink: slink,
      messages: messages,
      locale: locale,
    },
    revalidate: 10,
  };
};

export default SSlinkPage;
