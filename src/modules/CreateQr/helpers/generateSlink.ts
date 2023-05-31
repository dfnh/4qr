import { getSlinkUrl } from '~/helpers/getBaseUrl';
import { nanoid } from '~/utils/nanoid';

export const generateSlink = async () => {
  const slink = await nanoid();
  const link = getSlinkUrl(slink);

  return { slink, link };
};
