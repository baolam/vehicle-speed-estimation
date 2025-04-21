import React from 'react';
import { ListGroup } from 'react-bootstrap';

const Functions = () => {
  return (
    <ListGroup>
      <ListGroup.Item>
        <h4 className="text-center">User management</h4>
      </ListGroup.Item>
      <ListGroup.Item action href="#user-list">
        User List
      </ListGroup.Item>
      <ListGroup.Item action href="#assign-role" disabled>
        Assign Role
      </ListGroup.Item>

      <ListGroup.Item>
        <h4 className="text-center">Device management</h4>
      </ListGroup.Item>
      <ListGroup.Item action href="#device-list">
        Device list
      </ListGroup.Item>
      <ListGroup.Item action href="#device-information">
        Device Information
      </ListGroup.Item>
    </ListGroup>
  );
};

export default Functions;
