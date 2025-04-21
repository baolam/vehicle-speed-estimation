import React, { useContext, useEffect, useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavbarPage from '../../components/NavbarPage';
import { onLoginUser } from './user.api';
import { LoginContext } from '../../providers/LoginProvider';

export interface ILoginInfo {
  username: string;
  password: string;
}

const UserLogin = () => {
  const navigate = useNavigate();
  const { onLogin, login } = useContext(LoginContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = () => {
    const infor = {
      username,
      password,
    };
    onLoginUser(infor)
      .then(({ token }) => {
        localStorage.setItem('token', token);
        setError(null);
        onLogin();
      })
      .catch((err) => {
        // setError('Troube with log in. Try again later!');
        setError(err.response.data.message);
      });
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
    if (login) {
      navigate('/user');
    }
  }, [error, login, navigate]);

  return (
    <>
      <NavbarPage />
      <Container className="fluid d-flex justify-content-center align-items-center vh-100">
        <Form className="border p-4 rounded shadow" style={{ width: 500 }}>
          <h2 className="text-center mb-4">Login</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="password" className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 mt-3"
            onClick={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            Login
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default UserLogin;
