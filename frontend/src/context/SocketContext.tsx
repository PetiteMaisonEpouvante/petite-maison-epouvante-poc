import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth0 } from '@auth0/auth0-react';

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    let s: Socket;

    const connect = async () => {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          transport: ['websocket'],
        },
      });
      s = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
        auth: { token },
      });
      setSocket(s);
    };

    connect();

    return () => {
      s?.disconnect();
      setSocket(null);
    };
  }, [isAuthenticated, getAccessTokenSilently]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export const useSocket = () => useContext(SocketContext);
