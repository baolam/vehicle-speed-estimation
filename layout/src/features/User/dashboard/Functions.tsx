import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { useAppSelector } from '../../../hooks/redux.hook';

const Functions = () => {
  const role = useAppSelector((state) => state.user.user.role);

  return (
    <ListGroup>
      <ListGroup.Item>
        <h4 className="text-center">General</h4>
      </ListGroup.Item>
      <ListGroup.Item action href="#account-infor">
        Account Information
      </ListGroup.Item>
      <ListGroup.Item>
        <h4 className="text-center">Vechile Management</h4>
      </ListGroup.Item>
      <ListGroup.Item action href="#vehicle-list">
        Vehicle List
      </ListGroup.Item>
      <ListGroup.Item action href="#vehicle-detail">
        Vehicle Detail
      </ListGroup.Item>
      {role === 'police' && (
        <>
          <ListGroup.Item>
            <h4 className="text-center">Device Management</h4>
          </ListGroup.Item>
          <ListGroup.Item action href="#device-list">
            Device List
          </ListGroup.Item>
          <ListGroup.Item action href="#device-detail">
            Device Detail
          </ListGroup.Item>
        </>
      )}
    </ListGroup>
  );
};

export default Functions;
