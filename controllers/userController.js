const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Signup Controller
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    res.clearCookie('token', cookieOptions()); // Clear any existing token

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

// Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  try {
    res.clearCookie('token', cookieOptions());

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, cookieOptions());
    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Logout Controller
exports.logout = (req, res) => {
  res.clearCookie('token', cookieOptions());
  res.json({ message: 'Logout successful' });
};

// Common cookie settings
const cookieOptions = () => ({
  httpOnly: true,
  secure: true, // Required for SameSite=None
  sameSite: 'None',
    domain: 'entertain-hub2-f22q.vercel.app', 
  maxAge: 24 * 60 * 60 * 1000, // 1 day
});
