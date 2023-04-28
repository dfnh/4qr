import geoip from 'fast-geoip';

geoip.enableCache();

const getLocation = (ip: string) => geoip.lookup(ip);

export { getLocation };
