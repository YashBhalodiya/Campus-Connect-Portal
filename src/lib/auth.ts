import { jwtDecode } from 'jwt-decode';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
}

interface DecodedToken {
  user: {
    id: string;
    role: string;
  };
  exp: number;
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }
    
    return true;
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return false;
  }
};

// Set authentication data
export const setAuth = (token: string, user: User): void => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// Clear authentication data
export const clearAuth = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = (): User | null => {
  if (!isAuthenticated()) return null;
  
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as User;
  } catch (error) {
    return null;
  }
};

// Check if user is faculty
export const isFaculty = (): boolean => {
  const user = getCurrentUser();
  return user ? user.role === 'faculty' || user.role === 'admin' : false;
};

// Check if user is admin
export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user ? user.role === 'admin' : false;
};