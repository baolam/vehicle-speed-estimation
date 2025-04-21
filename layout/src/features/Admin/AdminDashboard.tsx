import React, { useContext, useEffect, useState } from 'react';
import { Col, Row, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Functions from './dashboard/Functions';
import NavbarPage from '../../components/NavbarPage';
import { LoginContext } from '../../providers/LoginProvider';
import UserList from './dashboard/UserList';
import AssignRole from './dashboard/AssignRole';
import DeviceList from './dashboard/DeviceList';
import DeviceInformation from './dashboard/DeviceInformation';

const AdminDashboard = () => {
  const { login } = useContext(LoginContext);
  const navigate = useNavigate();
  const [deviceCode, setDeviceCode] = useState<string>('');

  useEffect(() => {
    if (!login) {
      navigate('/admin/login');
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
              <Tab.Pane eventKey="#user-list">
                <UserList />
              </Tab.Pane>
              <Tab.Pane eventKey="#assign-role">
                <AssignRole />
              </Tab.Pane>
              <Tab.Pane eventKey="#device-list">
                <DeviceList
                  deviceCode={deviceCode}
                  onChooseId={(_id: string) => setDeviceCode(_id)}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="#device-information">
                <DeviceInformation deviceCode={deviceCode} />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </>
  );
};

export default AdminDashboard;
