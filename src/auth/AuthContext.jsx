import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  registerUser, 
  loginUser, 
  fetchUser,
  fetchUserBoards
} from '../api/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = async (userId) => {
    try {
      const [userData, boards] = await Promise.all([
        fetchUser(userId),
        fetchUserBoards(userId)
      ]);
      return { ...userData, boards };
    } catch (error) {
      console.error('Failed to load user data:', error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await loadUserData(token);
          setUser(userData);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const register = async (email, password, name) => {
    try {
      const user = await registerUser({ email, password, name });
      localStorage.setItem('token', user.id);
      setUser({ ...user, boards: [] });
      return user;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const user = await loginUser({ email, password });
      const userData = await loadUserData(user.id);
      localStorage.setItem('token', user.id);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);