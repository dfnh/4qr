import QrScanner from 'qr-scanner';

const getListCameras = async (perms = false) => {
  const devices = await QrScanner.listCameras(perms);
  const cams = devices.filter((d) => d.id != '');
  return cams;
};

export { getListCameras };
