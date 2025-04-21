import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Row, Tab } from 'react-bootstrap';

import Functions from './dashboard/Functions';
import { LoginContext } from '../../providers/LoginProvider';
import NavbarPage from '../../components/NavbarPage';
import UserAccount from './dashboard/UserAccount';
import VehicleList from './dashboard/VehicleList';
import VehicleDetail from './dashboard/VehicleDetail';
import { useAppSelector } from '../../hooks/redux.hook';
import DeviceList from './dashboard/DeviceList';
import DeviceDetail from './dashboard/DeviceDetail';

const UserDashboard = () => {
  const { login } = useContext(LoginContext);
  const navigate = useNavigate();
  const [vehicleId, setVehicleId] = useState<number>(1);
  const role = useAppSelector((state) => state.user.user.role);

  useEffect(() => {
    if (!login) {
      navigate('/user/login');
    }
  }, [login, navigate]);

  return (
    <>
      <NavbarPage />
      <Tab.Container>
        <Row>
          <Col xs={3}>
            <Functions />
          </Col>
          <Col xs={9}>
            <Tab.Content>
              <Tab.Pane eventKey="#account-infor">
                <UserAccount />
              </Tab.Pane>
              <Tab.Pane eventKey="#vehicle-list">
                <VehicleList
                  vehicleId={vehicleId}
                  onChooseId={(_id: number) => setVehicleId(_id)}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="#vehicle-detail">
                <VehicleDetail id={vehicleId} />
              </Tab.Pane>
              {role === 'police' && (
                <>
                  <Tab.Pane eventKey="#device-list">
                    <DeviceList />
                  </Tab.Pane>
                  <Tab.Pane eventKey="#device-detail">
                    <DeviceDetail />
                  </Tab.Pane>
                </>
              )}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </>
  );
};

export default UserDashboard;
