import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../../hooks/redux.hook';
// import { IDeviceInfo } from '../user.store';
import { getDetailDevice } from '../../Admin/admin.api';
import { IDeviceInfo } from '../../Admin/admin.store';
// import { onGetDeviceDetail } from '../user.api';

const DeviceDetail = () => {
  const { deviceCode } = useAppSelector((state) => state.user.deviceSelected);
  const [deviceDetail, setDeviceDetail] = useState<IDeviceInfo | null>(null);

  useEffect(() => {
    if (deviceCode === null || deviceCode === '') return;

    getDetailDevice(deviceCode)
      .then((resp) => setDeviceDetail(resp))
      .catch(() => setDeviceDetail(null));
  }, [deviceCode]);

  // eslint-disable-next-line
  console.log(deviceDetail);

  return <div>DeviceDetail</div>;
};

export default DeviceDetail;
