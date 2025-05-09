import React from 'react';
import { Alert } from 'react-bootstrap';
import { useAppSelector } from '../../../hooks/redux.hook';

interface IProps {
  id: number;
}

const VehicleDetail: React.FC<IProps> = ({ id }) => {
  const vehicles = useAppSelector((state) => state.user.userDetail.vehicles);
  const vehicle = vehicles.find((_vehicle) => _vehicle.id === id);

  return (
    <>
      {vehicle === undefined && <div>Vehicle not found</div>}
      {vehicle && (
        <>
          <h4 className="text-center">Some information</h4>
          <Alert>Vehicle type: {vehicle.vehicleType}</Alert>
          <Alert>Vehicle license plate: {vehicle.licensePlate}</Alert>
        </>
      )}
    </>
  );
};

export default VehicleDetail;
