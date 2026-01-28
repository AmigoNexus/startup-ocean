import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const register = async (data) => {
    try {
      const response = await authAPI.register(data);
      if (response.data.success) {
        return true;
      } else {
        alert(response.data.message || 'Registration failed');
        return false;
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const requestLoginOtp = async (email) => {
    try {
      const response = await authAPI.requestLoginOtp(email);
      if (response.data.success) {
        return true;
      } else {
        alert(response.data.message || 'Failed to send OTP');
        return false;
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send OTP');
      return false;
    }
  };

  const verifyLoginOtp = async (email, otp) => {
    try {
      const response = await authAPI.verifyLoginOtp({ email, otp });

      if (response.data) {
        const { token, ...userData } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      alert(error.response?.data?.message || 'Invalid OTP');
      return false;
    }
  };

  const verifyRegistrationOtp = async (email, otp) => {
    try {
      const response = await authAPI.verifyOtp({ email, otp });

      if (response.data.success && response.data.data) {
        const { token, ...userData } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return true;
      } else {
        alert(response.data.message || 'OTP verification failed');
        return false;
      }
    } catch (error) {
      alert(error.response?.data?.message || 'OTP verification failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('pendingCompanyData');
    setUser(null);
  };

  const value = {
    user,
    loading,
    register,
    requestLoginOtp,
    verifyLoginOtp,
    verifyRegistrationOtp,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
