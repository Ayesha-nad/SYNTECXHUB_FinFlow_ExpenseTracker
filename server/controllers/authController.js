const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

// In-memory users for local offline fallback
let fallbackUsers = [
  {
    _id: 'usr_demo_1',
    name: 'Ayesha Demo',
    email: 'demo@finflow.app',
    passwordHash: '$2a$10$X8Q18eB179YgW.7eIuUj..L13rA5jDflc8227b6jK7xK.XbN6yJ9a', // 'password123'
    avatarColor: '#6366F1',
    monthlyBudget: 150000,
    createdAt: new Date().toISOString()
  }
];

// Helper to generate JWT Token (expires in 30 days)
const generateToken = (id, name, email) => {
  return jwt.sign({ id, name, email }, JWT_SECRET, {
    expiresIn: '30d'
  });
};

const AVATAR_COLORS = [
  '#6366F1', // Indigo
  '#10B981', // Emerald
  '#06B6D4', // Cyan
  '#EC4899', // Rose
  '#F59E0B', // Amber
  '#8B5CF6', // Violet
  '#3B82F6'  // Blue
];

/**
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a full name' });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide an email address' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name.trim();
    const randomAvatar = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

    if (getIsConnected()) {
      const userExists = await User.findOne({ email: cleanEmail });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists' });
      }

      const user = await User.create({
        name: cleanName,
        email: cleanEmail,
        password,
        avatarColor: randomAvatar,
        monthlyBudget: 150000
      });

      const token = generateToken(user._id, user.name, user.email);

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatarColor: user.avatarColor,
          monthlyBudget: user.monthlyBudget,
          token
        }
      });
    }

    // Local Fallback Storage
    const existing = fallbackUsers.find((u) => u.email === cleanEmail);
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      _id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: cleanName,
      email: cleanEmail,
      passwordHash,
      avatarColor: randomAvatar,
      monthlyBudget: 150000,
      createdAt: new Date().toISOString()
    };

    fallbackUsers.push(newUser);
    const token = generateToken(newUser._id, newUser.name, newUser.email);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        avatarColor: newUser.avatarColor,
        monthlyBudget: newUser.monthlyBudget,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};

/**
 * @desc Authenticate user & get token
 * @route POST /api/auth/login
 * @access Public
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (getIsConnected()) {
      const user = await User.findOne({ email: cleanEmail }).select('+password');

      if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id, user.name, user.email);

        return res.status(200).json({
          success: true,
          message: `Welcome back, ${user.name}!`,
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatarColor: user.avatarColor,
            monthlyBudget: user.monthlyBudget,
            token
          }
        });
      }

      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Local Fallback Storage
    const user = fallbackUsers.find((u) => u.email === cleanEmail);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.name, user.email);

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatarColor: user.avatarColor,
        monthlyBudget: user.monthlyBudget,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
};

/**
 * @desc Get current authenticated user profile
 * @route GET /api/auth/me
 * @access Private
 */
const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    if (getIsConnected()) {
      const user = await User.findById(req.user._id);
      return res.status(200).json({ success: true, data: user });
    }

    return res.status(200).json({ success: true, data: req.user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
