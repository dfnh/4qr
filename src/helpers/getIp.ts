import { type Request, getClientIp } from 'request-ip';

const getIp = (req: Request) => {
  return getClientIp(req);
};

export { getIp };
