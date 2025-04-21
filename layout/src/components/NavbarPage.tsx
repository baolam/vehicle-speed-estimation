import React, { useContext } from 'react';
import {
  OverlayTrigger,
  Nav,
  Navbar,
  Container,
  Tooltip,
} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux.hook';
import { LoginContext } from '../providers/LoginProvider';
import { SocketContext } from '../providers/SocketProvider';

function NavbarPage() {
  const userRole = useAppSelector((state) => state.user.user.role);
  const { login, onLogout } = useContext(LoginContext);
  const { disconnectToServer } = useContext(SocketContext);
  const name = useAppSelector((state) => state.user.user.name);

  const initalizePath = userRole === 'admin' ? '/admin' : '/user';

  return (
    <Navbar
      bg="dark"
      expand="lg"
      className="bg-body-tertiary"
      data-bs-theme="dark"
    >
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          Our project
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to={initalizePath}>
              Home
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        {login && (
          <Navbar.Text
            className="ms-auto"
            onClick={() => {
              onLogout();
              disconnectToServer();
            }}
          >
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip id="tooltip-disabled">Clicked me to logout</Tooltip>
              }
            >
              <span>Hello {name}</span>
            </OverlayTrigger>
          </Navbar.Text>
        )}
      </Container>
    </Navbar>
  );
}

export default NavbarPage;
