import React, { useEffect, useState } from 'react';
import { Table, ButtonGroup, Button, Form, InputGroup } from 'react-bootstrap';
import { IUserManagement } from '../admin.store';
import { onGetAllUser } from '../admin.api';
import PaginationComponent from '../../../components/PaginationComponent';

const UserList = () => {
  const [lists, setLists] = useState<IUserManagement[] | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    onGetAllUser(page)
      .then((data) => {
        setTotalPages(data.totalPages);
        setLists(data.users);
      })
      .catch(() => setLists(null));
  }, [page]);

  const onPreviousPage = () => {
    setPage(page - 1);
  };

  const onNextPage = () => {
    setPage(page + 1);
  };

  return (
    <>
      <h4 className="text-center">User List</h4>
      <Form>
        <InputGroup>
          <Form.Control type="search" placeholder="Search..." />
          <Button variant="outline-success">Search</Button>
        </InputGroup>
      </Form>
      <hr />
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lists !== null &&
            lists.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <ButtonGroup>
                    <Button variant="primary" size="sm">
                      Change Role
                    </Button>
                    <Button variant="danger" size="sm">
                      Delete
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <PaginationComponent
        page={page}
        totalPages={totalPages}
        onPrevious={onPreviousPage}
        onNext={onNextPage}
      />
    </>
  );
};

export default UserList;
