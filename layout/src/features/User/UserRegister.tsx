import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { onRegister } from './user.api';
import NavbarPage from '../../components/NavbarPage';

export interface IUserRegisterInfo {
  username: string;
  name: string;
  password: string;
}

const UserRegister = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const onSubmit = () => {
    const infor = {
      username,
      password,
      name,
    };
    onRegister(infor)
      .then(() => {
        setError(null);
        navigate('/user/login');
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <>
      <NavbarPage />
      <Container className="fluid d-flex justify-content-center align-items-center vh-100">
        <Form className="border p-4 rounded shadow" style={{ width: 500 }}>
          <h2 className="text-center mb-4">Register</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </Form.Group>

          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
          </Form.Group>

          <Form.Group controlId="password" className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 mt-3"
            onClick={onSubmit}
          >
            Register
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default UserRegister;
