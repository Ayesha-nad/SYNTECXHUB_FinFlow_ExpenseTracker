const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'finflow_super_secret_jwt_key_2026';

// Middleware to verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      if (getIsConnected()) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        req.user = { _id: decoded.id, name: decoded.name, email: decoded.email };
      }

      return next();
    } catch (error) {
      console.error('JWT Token Verification Error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed or expired'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided'
    });
  }
};

// Optional auth middleware (sets req.user if token is provided, but continues if not)
const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      if (getIsConnected()) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        req.user = { _id: decoded.id, name: decoded.name, email: decoded.email };
      }
    } catch {
      // ignore invalid token in optional mode
    }
  }
  next();
};

module.exports = { protect, optionalAuth, JWT_SECRET };
