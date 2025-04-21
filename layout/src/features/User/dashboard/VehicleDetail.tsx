import React from 'react';
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
      {vehicle && <p>Data found</p>}
    </>
  );
};

export default VehicleDetail;
