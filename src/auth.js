---
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Assuming a Mongoose model for users

const router = express.Router();

// Middleware to check user role
const checkRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

// Route to register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Create a new user
    user = new User({
      username,
      password: bcrypt.hashSync(password, 8),
      role: 'user', // Default role for new users
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to login a user and return JWT token
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    let user = await User.findOne({ username });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '2h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get user profile
router.get('/profile', checkRole('user'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get admin profile
router.get('/admin/profile', checkRole('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;