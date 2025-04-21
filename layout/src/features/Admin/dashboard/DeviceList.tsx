import React, { useEffect, useState } from 'react';
import { Table, ButtonGroup, Button, Form, InputGroup } from 'react-bootstrap';
import { getAllDevices } from '../admin.api';
import { IDeviceListManagement } from '../admin.store';
import PaginationComponent from '../../../components/PaginationComponent';

interface IProps {
  onChooseId: (_id: string) => void;
  deviceCode: string;
}

const DeviceList: React.FC<IProps> = ({ onChooseId, deviceCode }) => {
  const [lists, setLists] = useState<IDeviceListManagement[] | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    getAllDevices(page)
      .then((data) => {
        setLists(data.devices);
        setTotalPages(data.totalPages);
      })
      .catch(() => setLists([]));
  }, [page]);

  const onPreviousPage = () => {
    setPage(page - 1);
  };

  const onNextPage = () => {
    setPage(page + 1);
  };

  return (
    <>
      <h4 className="text-center">Device List</h4>
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
            <th>Device Code</th>
            <th>User Id</th>
            <th>Name</th>
            <th>Street</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {lists !== null &&
            lists.map((device) => (
              <tr
                key={device.deviceCode}
                className={
                  device.deviceCode === deviceCode ? 'table-primary' : ''
                }
              >
                <td>{device.deviceCode}</td>
                <td>{device.userId}</td>
                <td>{device.name}</td>
                <td>{device.street}</td>
                <td>
                  <ButtonGroup>
                    <Button
                      variant="primary"
                      onClick={() => onChooseId(device.deviceCode)}
                    >
                      Choose
                    </Button>
                    <Button variant="danger">Delete</Button>
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

export default DeviceList;
