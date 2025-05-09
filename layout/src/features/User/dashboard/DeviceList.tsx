import React, { useEffect, useId, useState } from 'react';
import { Button, ButtonGroup, Table } from 'react-bootstrap';
import { onGetAllDevice } from '../user.api';
import { IDeviceUser, updateChoosenDevice } from '../user.store';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux.hook';

const DeviceList = () => {
  const [lists, setLists] = useState<IDeviceUser[] | null>(null);
  const { deviceCode } = useAppSelector((state) => state.user.deviceSelected);
  const dispatch = useAppDispatch();
  const id = useId();

  useEffect(() => {
    if (lists !== null) return;

    onGetAllDevice()
      .then((resp) => setLists(resp))
      .catch(() => setLists(null));
  });

  return (
    <>
      <h4 className="text-center">Device list</h4>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Steet</th>
            <th>Online status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lists === null && (
            <tr>
              <td>No data</td>
            </tr>
          )}
          {lists !== null &&
            lists.map((deviceInfo) => (
              <tr
                key={`${id}_${deviceInfo.deviceCode}`}
                className={
                  deviceInfo.deviceCode === deviceCode ? 'table-primary' : ''
                }
              >
                <td>{deviceInfo.id}</td>
                <td>{deviceInfo.deviceCode}</td>
                <td>{deviceInfo.street}</td>
                <td>{deviceInfo.online ? 'Online' : 'Offline'}</td>
                <td>
                  <ButtonGroup>
                    <Button
                      onClick={() =>
                        dispatch(updateChoosenDevice(deviceInfo.deviceCode))
                      }
                    >
                      Choose
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
};

export default DeviceList;
