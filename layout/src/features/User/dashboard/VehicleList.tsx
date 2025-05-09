import React from 'react';
import { ButtonGroup, Table, Button } from 'react-bootstrap';
import { useAppSelector } from '../../../hooks/redux.hook';
import AddVehicle from './AddVehicle';

interface IProps {
  onChooseId: (_id: number) => void;
  vehicleId: number;
}

const VehicleList: React.FC<IProps> = ({ onChooseId, vehicleId }) => {
  const { vehicles } = useAppSelector((state) => state.user.userDetail);

  return (
    <>
      <h4 className="text-center">Vehicle List</h4>
      <Table bordered hover>
        <thead>
          <tr>
            <th>Vehicle ID</th>
            <th>Vehicle Type</th>
            <th>Manufacturer</th>
            <th>License Plate</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.length === 0 && (
            <tr>
              <td>No data</td>
            </tr>
          )}
          {vehicles.map((vehicle) => (
            <tr
              key={vehicle.id}
              className={vehicle.id === vehicleId ? 'table-primary' : ''}
            >
              <td>{vehicle.id}</td>
              <td>{vehicle.vehicleType}</td>
              <td>{vehicle.manufacturer}</td>
              <td>{vehicle.licensePlate}</td>
              <td>
                <ButtonGroup>
                  <Button
                    variant="primary"
                    onClick={() => onChooseId(vehicle.id)}
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
      <hr />
      <h4 className="text-center">Action vehicle</h4>
      <AddVehicle />
    </>
  );
};

export default VehicleList;
