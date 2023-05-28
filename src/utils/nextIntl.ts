import deepmerge from 'deepmerge';
import { type GetServerSidePropsContext, type GetStaticPropsContext } from 'next';

//fixme types
const getLocaleMessages = async (
  context: GetStaticPropsContext | GetServerSidePropsContext
) => {
  // eslint-disable-next-line
  const localeMessages = (await import(`../../messages/${context?.locale ?? 'en'}.json`))
    ?.default;
  const defaultMessages = (await import(`../../messages/en.json`)).default;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const messages = deepmerge(defaultMessages, localeMessages);
  return messages;
};

export default getLocaleMessages;
