const express = require('express');
const router = express.Router();
const { signup, login,logout } = require('../controllers/userController');

// Signup route
router.post('/signup', signup);

// Login route
router.post('/login', login);

router.post('/logout',logout)

module.exports = router;
