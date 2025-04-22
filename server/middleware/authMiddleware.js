import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to authenticate users
export const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Set user data in request
    req.user = decoded.user;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if user is faculty
export const isFaculty = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'faculty' && user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied, faculty or admin permission required' });
    }
    
    next();
  } catch (error) {
    console.error('Faculty permission check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Middleware to check if user is admin
export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied, admin permission required' });
    }
    
    next();
  } catch (error) {
    console.error('Admin permission check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};