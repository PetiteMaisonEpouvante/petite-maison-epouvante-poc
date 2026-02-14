import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { syncUser, getMe } from '../api/users';
import { setAuthInterceptor } from '../api/client';
import type { User } from '../types';

interface UserContextType {
  dbUser: User | null;
  loading: boolean;
  authReady: boolean;
  refresh: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  dbUser: null,
  loading: true,
  authReady: false,
  refresh: async () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, getAccessTokenSilently, user: auth0User } = useAuth0();
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [interceptorSet, setInterceptorSet] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  // Set auth interceptor once
  useEffect(() => {
    if (isAuthenticated && !interceptorSet) {
      setAuthInterceptor(getAccessTokenSilently);
      setInterceptorSet(true);
      setAuthReady(true);
    } else {
      setAuthReady(false);
    }
  }, [isAuthenticated, getAccessTokenSilently, interceptorSet]);

  // Sync user on login
  useEffect(() => {
    if (!isAuthenticated || !auth0User || !interceptorSet) {
      setLoading(false);
      return;
    }

    const doSync = async () => {
      try {
        await syncUser({
          email: auth0User.email!,
          nickname: auth0User.nickname,
          avatar: auth0User.picture,
        });
        const me = await getMe();
        setDbUser(me);
      } catch (e) {
        console.error('User sync failed:', e);
      } finally {
        setLoading(false);
      }
    };

    doSync();
  }, [isAuthenticated, auth0User, interceptorSet]);

  const refresh = useCallback(async () => {
    try {
      const me = await getMe();
      setDbUser(me);
    } catch {
      // ignore
    }
  }, []);

  return (
    <UserContext.Provider value={{ dbUser, loading, authReady, refresh }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
