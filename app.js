// app.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

// ✅ Required for trusting Render/Vercel proxy headers like X-Forwarded-For
app.set('trust proxy', 1);

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: 'https://entertain-hub2-f22q.vercel.app', // Your frontend dev server
    credentials: true,
  })
);


// Static image route


// Routes
const userRoutes = require('./routes/users');

app.use('/api/user', userRoutes);


// Scheduler (every minute)

// MongoDB connection and server start
const PORT = process.env.PORT || 4001;
const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://preetindersingh565:aPZzCDbwerc52PGS@users.btmbi4r.mongodb.net/?retryWrites=true&w=majority&appName=users';

mongoose
  .connect(MONGO_URI, {

  })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

// Global error handler
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

module.exports = app;