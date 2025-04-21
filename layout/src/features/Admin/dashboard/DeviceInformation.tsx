import React, { useContext, useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import {
  IDeviceInfo,
  IEnhancerMethod,
  ISpeedEstimatorMethod,
} from '../admin.store';
import { getDetailDevice } from '../admin.api';
import { SocketContext } from '../../../providers/SocketProvider';

interface IProps {
  deviceCode: string;
}

const DeviceInformation: React.FC<IProps> = ({ deviceCode }) => {
  const [deviceInfo, setDeviceInfo] = useState<IDeviceInfo | null>(null);
  const [targetDeviceId, setTargetDeviceId] = useState('');
  const [enhancerMethod, setEnhancerMethod] = useState<IEnhancerMethod | null>(
    null
  );
  const [speedEstimatorMethod, setSpeedEstimatorMethod] =
    useState<ISpeedEstimatorMethod | null>(null);

  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if (deviceCode === '') return;
    getDetailDevice(deviceCode)
      .then((resp) => {
        setDeviceInfo(resp);
        if (resp.online) {
          socket?.emit('device-infor-status', resp.deviceCode);
        }
      })
      .catch(() => setDeviceInfo(null));
  }, [deviceCode, socket]);

  useEffect(() => {
    socket?.on('request-enhancer-infor', (infor: IEnhancerMethod) => {
      setEnhancerMethod(infor);
    });

    socket?.on(
      'request-speed-estimator-infor',
      (infor: ISpeedEstimatorMethod) => {
        setSpeedEstimatorMethod(infor);
      }
    );

    socket?.on('device-infor-status', (deviceSocketId: string | null) => {
      if (deviceSocketId === null) return;
      if (deviceInfo !== null && !deviceInfo.online) {
        setDeviceInfo({ ...deviceInfo, online: true });
      }
      setTargetDeviceId(deviceSocketId);
    });

    return () => {
      socket?.off('device-infor-status');
      socket?.off('request-enhancer-infor');
      socket?.off('request-speed-estimator-infor');
    };
  }, [socket, deviceInfo]);

  const onRequestAdditionalInformation = () => {
    let requested = false;
    if (socket == null) return;
    if (enhancerMethod == null) {
      requested = true;
      socket.emit('request-device', {
        deviceId: targetDeviceId,
        event: 'request-enhancer-infor',
      });
    }
    if (speedEstimatorMethod == null) {
      requested = true;
      socket.emit('request-device', {
        deviceId: targetDeviceId,
        event: 'request-speed-estimator-infor',
      });
    }
    if (requested) {
      // alert('Request infor successfully!');
    } else {
      alert('Data existed! Request failed!');
    }
  };

  const shouldRequestAdditional =
    deviceInfo &&
    deviceInfo.online &&
    enhancerMethod === null &&
    speedEstimatorMethod === null;

  return (
    <>
      <h4 className="text-center">General Information</h4>
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className="fw-bold">{deviceInfo?.deviceCode}</Card.Title>

          <Card.Text>
            <strong>ID:</strong> {deviceInfo?.deviceCode} <br />
            <strong>Street:</strong> {deviceInfo?.street} <br />
            <strong>Online:</strong> {deviceInfo?.online ? 'Yes' : 'No'}
          </Card.Text>
        </Card.Body>
        <hr />
        {!deviceInfo?.online ||
          (shouldRequestAdditional && <h4 className="text-center">Actions</h4>)}
        {!deviceInfo?.online && (
          <Button
            onClick={() => {
              socket?.emit('device-infor-status', deviceInfo?.deviceCode);
            }}
          >
            Try to connect device!
          </Button>
        )}
        {shouldRequestAdditional && (
          <>
            <Button onClick={() => onRequestAdditionalInformation()}>
              Request additional information
            </Button>
            <hr />
          </>
        )}
        <h4 className="text-center">Ehancer Method</h4>
        {enhancerMethod === null ? (
          'No data found!'
        ) : (
          <Card.Text>
            <strong>
              Skip enhancement method:{' '}
              {enhancerMethod.skip_enhancement ? 'Yes' : 'No'}
            </strong>
            <br />
            <strong>
              Using sharpen: {enhancerMethod.sharpen ? 'Yes' : 'No'}
            </strong>
            <br />
            <strong>
              Using gamma: {enhancerMethod.gamma_infor.skip ? 'No' : 'Yes'}
            </strong>
            {!enhancerMethod.gamma_infor.skip && (
              <>
                <strong>Gamma value: {enhancerMethod.gamma_infor.gamma}</strong>
                <br />
              </>
            )}
            <br />
            <strong>
              Adjust general using:{' '}
              {enhancerMethod.adjust_general.skip ? 'No' : 'Yes'}
            </strong>
            {!enhancerMethod.adjust_general.skip && (
              <>
                <strong>
                  Brightness : {enhancerMethod.adjust_general.brightness}
                </strong>
                <br />
              </>
            )}
            {!enhancerMethod.adjust_general.skip && (
              <>
                <strong>
                  Contrast : {enhancerMethod.adjust_general.contrast}
                </strong>
                <br />
              </>
            )}
          </Card.Text>
        )}
        <h4 className="text-center">Speed estimator configuration</h4>
        {speedEstimatorMethod === null ? (
          'No data found!'
        ) : (
          <Card.Text>
            <strong>
              Actual Length (based on detection zone, converting to meters) :{' '}
              {speedEstimatorMethod.actual_length.width}(m) width and{' '}
              {speedEstimatorMethod.actual_length.height}(m) height
            </strong>
            <br />
          </Card.Text>
        )}
      </Card>
    </>
  );
};

export default DeviceInformation;
