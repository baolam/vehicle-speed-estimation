import React, { useContext, useEffect, useRef, useState } from 'react';
import { Card, Image } from 'react-bootstrap';
import { useAppSelector } from '../../../hooks/redux.hook';
import { getDetailDevice } from '../../Admin/admin.api';
import { IDeviceInfo } from '../../Admin/admin.store';
import { SocketContext } from '../../../providers/SocketProvider';

const DeviceDetail = () => {
  const { deviceCode } = useAppSelector((state) => state.user.deviceSelected);
  const [deviceDetail, setDeviceDetail] = useState<IDeviceInfo | null>(null);
  const { socket } = useContext(SocketContext);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (deviceCode === null || deviceCode === '') return;

    getDetailDevice(deviceCode)
      .then((resp) => setDeviceDetail(resp))
      .catch(() => setDeviceDetail(null));
  }, [deviceCode]);

  // eslint-disable-next-line
  // console.log(deviceDetail);

  useEffect(() => {
    socket?.on('streaming', (hotImg: string) => {
      // console.log(hotImg);
      if (imageRef === null || imageRef.current === null) return;
      imageRef.current.src = hotImg;
    });

    return () => {
      socket?.off('streaming');
    };
  }, [socket]);

  return (
    <>
      <h4 className="text-center">Overall</h4>
      <Card>
        <Card.Body>
          <Card.Title className="fw-bold">
            {deviceDetail?.deviceCode}
          </Card.Title>

          <Card.Text>
            <strong>ID:</strong> {deviceDetail?.deviceCode} <br />
            <strong>Street:</strong> {deviceDetail?.street} <br />
            <strong>Online:</strong> {deviceDetail?.online ? 'Yes' : 'No'}
          </Card.Text>
        </Card.Body>
      </Card>
      <h4 className="text-center">Streaming image</h4>
      <Image
        alt="Result from device"
        ref={imageRef}
        style={{ width: '640px', height: '480px' }}
      />
      <hr />
    </>
  );
};

export default DeviceDetail;
