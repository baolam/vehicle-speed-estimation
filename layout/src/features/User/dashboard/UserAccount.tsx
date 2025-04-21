import React from 'react';
import { Card } from 'react-bootstrap';
import { useAppSelector } from '../../../hooks/redux.hook';

const UserAccount = () => {
  const { id, name, username, userRole } = useAppSelector(
    (state) => state.user.userDetail
  );

  return (
    <>
      <h4 className="text-center">Information</h4>
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className="fw-bold">{username}</Card.Title>

          <Card.Text>
            <strong>ID:</strong> {id} <br />
            <strong>Name:</strong> {name} <br />
            <strong>Role:</strong> {userRole}
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
};

export default UserAccount;
