import { useEffect, useState } from 'react';
import AuthContext from './AuthContext';

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem('accessToken')
  );

  const [refreshToken, setRefreshToken] = useState(
    () => localStorage.getItem('refreshToken')
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
useEffect(() => {
  const handleAuthLogout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  window.addEventListener('auth:logout', handleAuthLogout);

  return () => {
    window.removeEventListener('auth:logout', handleAuthLogout);
  };
}, []);

  const login = (access, refresh, userData) => {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('user', JSON.stringify(userData));

    setAccessToken(access);
    setRefreshToken(refresh);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}