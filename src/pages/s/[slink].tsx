import { type GetServerSidePropsContext, type InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { omit } from '~/helpers/omit';

const SlinkInner = dynamic(() => import('~/modules/SSlink')); //????

type SSlinkPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;
const SSlinkPage = ({ slink, geo }: SSlinkPageProps) => {
  return (
    <>
      <Head>
        <title>Slink</title>
      </Head>
      <div>
        <div className="relative flex flex-col items-center justify-center">
          <SlinkInner slink={slink} geo={geo} />
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ slink: string }>
) => {
  const slink = context.params?.slink;
  const locale = context.locale ? `/${context.locale}` : '';

  if (slink == null) {
    return { redirect: { destination: `${locale}/`, permanent: false } };
  }

  const geo = omit(context.query, 'slink');
  const messages = await (await import('~/utils/nextIntl')).default(context);
  return {
    props: { messages, slink, geo: geo },
  };
};

export default SSlinkPage;
