import geoip from 'fast-geoip';

geoip.enableCache();

const getLocation = async (ip: string) => {
  const location = await geoip.lookup(ip);
  if (!location) return null;

  const [lat, lon] = location.ll;
  return { ...location, lat, lon };
};

export { getLocation };
