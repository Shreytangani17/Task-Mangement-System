import { createContext, useState, useEffect, useRef } from 'react';
import API from '../utils/api';
import { warmupServer } from '../utils/api';

export const AuthContext = createContext();

// Keep-alive interval: ping every 4 minutes to prevent Vercel cold starts.
// Vercel freezes functions after ~5 min of inactivity, so 4 min keeps it warm.
const KEEP_ALIVE_MS = 4 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const keepAliveRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);

    // Start keep-alive pinger — fires every 4 min silently in background
    keepAliveRef.current = setInterval(() => {
      warmupServer();
    }, KEEP_ALIVE_MS);

    return () => clearInterval(keepAliveRef.current);
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const signup = async (name, email, password, role) => {
    const { data } = await API.post('/auth/signup', { name, email, password, role });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
