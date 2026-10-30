'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '@/lib/types';
import { getCurrentUser, login as authLogin, logout as authLogout, register as authRegister, initializeUsers } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message: string }>;
  register: (userData: any) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false, message: 'AuthContext not initialized' }),
  register: async () => ({ success: false, message: 'AuthContext not initialized' }),
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Initialize default users
    initializeUsers();
    
    // Check if user is already logged in for this tab session
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (username: string, password: string, rememberMe: boolean = false) => {
    const result = await authLogin(username, password, rememberMe);
    
    if (result.success && result.user) {
      setUser(result.user);
      
      // Redirect based on role
      if (result.user.role === 'admin') {
        router.push('/admin');
      } else if (result.user.role === 'chef') {
        router.push('/chef');
      } else {
        router.push('/customer');
      }
    }
    
    return result;
  };

  const register = async (userData: any) => {
    const result = await authRegister(userData);
    
    if (result.success && result.user) {
      setUser(result.user);
      router.push('/customer');
    }
    
    return result;
  };

  const logout = () => {
    authLogout();
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);