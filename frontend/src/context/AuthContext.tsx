import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: Role) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_CREDENTIALS: Record<Role, { email: string; pass: string; title: string }> = {
  FAMILY_CAREGIVER: { email: 'family@carepulse.com', pass: 'password123', title: 'Family Caregiver' },
  PROFESSIONAL_CAREGIVER: { email: 'professional@carepulse.com', pass: 'password123', title: 'Professional Caregiver' },
  CARE_COORDINATOR: { email: 'coordinator@carepulse.com', pass: 'password123', title: 'Care Coordinator' },
  CLINICAL_STAFF: { email: 'clinical@carepulse.com', pass: 'password123', title: 'Clinical Staff' },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('carepulse_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('carepulse_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (token) {
      authApi.getMe()
        .then((res) => {
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('carepulse_user', JSON.stringify(res.data));
          }
        })
        .catch(() => {
          logout();
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.login({ email, password: pass });
      if (res.success && res.data) {
        setToken(res.data.token);
        localStorage.setItem('carepulse_token', res.data.token);
        const userData: User = {
          id: res.data.id,
          fullName: res.data.fullName,
          email: res.data.email,
          role: res.data.role,
          active: true,
        };
        setUser(userData);
        localStorage.setItem('carepulse_user', JSON.stringify(userData));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(data);
      if (res.success && res.data) {
        setToken(res.data.token);
        localStorage.setItem('carepulse_token', res.data.token);
        const userData: User = {
          id: res.data.id,
          fullName: res.data.fullName,
          email: res.data.email,
          role: res.data.role,
          active: true,
        };
        setUser(userData);
        localStorage.setItem('carepulse_user', JSON.stringify(userData));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('carepulse_token');
    localStorage.removeItem('carepulse_user');
  };

  const switchDemoRole = async (role: Role) => {
    const cred = DEMO_CREDENTIALS[role];
    if (cred) {
      await login(cred.email, cred.pass);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, switchDemoRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};