import React, { createContext, useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux.hook';
import { logoutAction, retrieveUserInfo } from '../features/User/user.store';

interface ILoginProvider {
  login: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

interface ILoginProviderProps {
  children: React.ReactNode;
}

export const LoginContext = createContext<ILoginProvider>({
  login: false,
  onLogin: () => {},
  onLogout: () => {},
});

const LoginProvider: React.FC<ILoginProviderProps> = ({ children }) => {
  const user = useAppSelector((state) => state.user.user);

  const dispatch = useAppDispatch();
  const onLogin = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(retrieveUserInfo());
    }
  }, [dispatch]);

  const onLogout = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      localStorage.removeItem('token');
      dispatch(logoutAction());
    }
  }, [dispatch]);

  const providerValue = useMemo(
    () => ({
      login: user.name !== '',
      onLogin,
      onLogout,
    }),
    [user.name, onLogin, onLogout]
  );

  useEffect(() => {
    if (user.name === '') {
      onLogin();
    }
  }, [onLogin, user.name]);

  return (
    <LoginContext.Provider value={providerValue}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginProvider;
