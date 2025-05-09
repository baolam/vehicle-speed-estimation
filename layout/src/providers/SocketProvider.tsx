import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import io, { Socket } from 'socket.io-client';
import { LoginContext } from './LoginProvider';

const SOCKET_SERVER = 'http://localhost:3000/socket/user';

interface SocketProvider {
  socket: typeof Socket | null;
  disconnectToServer: () => void;
}

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketContext = createContext<SocketProvider>({
  socket: null,
  disconnectToServer: () => {},
});

const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<typeof Socket | null>(null);
  const { login } = useContext(LoginContext);

  useEffect(() => {
    if (!login) return;

    const token = localStorage.getItem('token');
    const newSocket = io(SOCKET_SERVER, {
      auth: {
        Authorization: `Bearer ${token}`,
      },
    });

    setSocket(newSocket);
    newSocket.on('device-connected', () => {
      // eslint-disable-next-line
      console.log('Thiết bị đã kết nối!');
    });

    newSocket.on('device-disconnected', () => {
      // eslint-disable-next-line
      console.log('Thiết bị mất kết nối');
    });

    newSocket.on('disconnect', () => {
      // newSocket.close();
      // alert('Mất kết nốt bất ngờ!');
      // eslint-disable-next-line
      console.log('Mất kết nối tới server!');
    });

    return () => {
      newSocket.disconnect();
    };
  }, [login]);

  const disconnectToServer = useCallback(() => {
    if (socket) {
      socket.close();
    }
  }, [socket]);

  const providerValue = useMemo(
    () => ({
      socket,
      disconnectToServer,
    }),
    [socket, disconnectToServer]
  );

  return (
    <SocketContext.Provider value={providerValue}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
