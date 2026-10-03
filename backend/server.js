const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const contactRoutes = require('./routes/contact');
const volunteerRoutes = require('./routes/volunteer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow requests from frontend (adjust in production as needed)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files if backend and frontend are hosted together
app.use(express.static(path.join(__dirname, '..')));

// MongoDB Atlas Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || MONGODB_URI.includes('<username>')) {
  console.warn('⚠️ WARNING: MONGODB_URI is not configured in backend/.env. Please update it with your MongoDB Atlas connection string.');
} else {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas successfully!'))
    .catch((err) => console.error('❌ MongoDB Atlas Connection Error:', err.message));
}

// API Routes
app.use('/api/contact', contactRoutes);
app.use('/api/volunteers', volunteerRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'Jayasri Kannan Foundation API',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Fallback to index.html for non-API GET routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    error: 'An internal server error occurred.'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Jayasri Kannan Foundation Backend API running on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`📬 Contact API: http://localhost:${PORT}/api/contact`);
  console.log(`🤝 Volunteer API: http://localhost:${PORT}/api/volunteers`);
});
