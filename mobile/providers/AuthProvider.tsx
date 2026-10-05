import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import type { AuthResponse, LoginCredentials, RegisterData, User } from '../types';
import * as authService from '../services/authService';
import { setUnauthorizedHandler } from '../services/authEvents';
import { tokenStorage } from '../services/api';
import { mockRepository } from '../services/mockRepository';
import { getProfile } from '../services/profileService';

interface AuthContextValue {
  user: User | null;
  isReady: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      void tokenStorage.clear().catch(() => undefined).finally(() => setUser(null));
    });
    void tokenStorage.get().then((token) => {
      if (!token) return undefined;
      return (process.env.EXPO_PUBLIC_USE_MOCK_API !== 'false' ? Promise.resolve(mockRepository.getUser()) : getProfile())
        .then(setUser)
        .catch(async () => { await tokenStorage.clear().catch(() => undefined); });
    }).catch(() => setUser(null)).finally(() => setIsReady(true));
    return () => setUnauthorizedHandler(undefined);
  }, []);

  const authenticate = async (action: () => Promise<AuthResponse>) => {
    const response = await action();
    setUser(response.user);
  };

  const value: AuthContextValue = {
    user,
    isReady,
    login: (credentials) => authenticate(() => authService.login(credentials)),
    register: (data) => authenticate(() => authService.register(data)),
    logout: async () => { await authService.logout(); setUser(null); },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}