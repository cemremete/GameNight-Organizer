import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, setAuthToken, getAuthToken } from '../lib/api';
import { connectSocket, disconnectSocket } from '../lib/socket';

interface User {
  id: string;
  email: string;
  username: string;
  timezone: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string, timezone?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // check for existing token on mount
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      authApi
        .getCurrentUser()
        .then(({ user }) => {
          setUser(user);
          connectSocket();
        })
        .catch(() => {
          setAuthToken(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { user, token } = await authApi.login({ email, password });
    setAuthToken(token);
    setUser(user);
    connectSocket();
  };

  const register = async (email: string, username: string, password: string, timezone?: string) => {
    const { user, token } = await authApi.register({ email, username, password, timezone });
    setAuthToken(token);
    setUser(user);
    connectSocket();
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    disconnectSocket();
  };

  const updateProfile = async (data: Partial<User>) => {
    const { user: updatedUser } = await authApi.updateProfile(data);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
