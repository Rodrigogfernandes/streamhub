import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageService } from '../services/storageservice';

export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'PREMIUM' | 'FREE';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, token: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoredAuth() {
      try {
        const storedToken = await StorageService.get<string>('streamhub_auth_token');
        const storedUser = await StorageService.get<User>(StorageService.KEYS.PROFILE);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Failed to load stored auth session:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStoredAuth();
  }, []);

  const login = async (email: string, jwtToken: string, userData: User) => {
    try {
      setToken(jwtToken);
      setUser(userData);
      await StorageService.set('streamhub_auth_token', jwtToken);
      await StorageService.set(StorageService.KEYS.PROFILE, userData);
    } catch (error) {
      console.error('Failed to store login session:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setToken(null);
      setUser(null);
      await StorageService.remove('streamhub_auth_token');
      await StorageService.remove(StorageService.KEYS.PROFILE);
    } catch (error) {
      console.error('Failed to clear login session:', error);
    }
  };

  const updateUser = async (userData: User) => {
    try {
      setUser(userData);
      await StorageService.set(StorageService.KEYS.PROFILE, userData);
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        user,
        token,
        loading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
