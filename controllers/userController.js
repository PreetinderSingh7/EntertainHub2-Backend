const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Signup Controller
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;


  try {
    // Clear any existing token cookie
    res.clearCookie('token');

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

// Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;
     console.log(req.body)
  try {
    // Clear any existing token cookie
    res.clearCookie('token');

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true, // Prevents access from client-side JS
      secure: true, // Use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: 'None' // CSRF protection
    });

    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Optional: Logout Controller
exports.logout = (req, res) => {
  res.clearCookie('token',{
    httpOnly: true, // Prevents access from client-side JS
    secure: true, // Use secure cookies in production
    sameSite: 'lax' // CSRF protection
  });
  res.json({ message: 'Logout successful' });
};
