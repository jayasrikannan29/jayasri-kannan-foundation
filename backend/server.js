const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const contactRoutes = require('./routes/contact');
const volunteerRoutes = require('./routes/volunteer');
const adminRoutes = require('./routes/admin');
const galleryRoutes = require('./routes/gallery');
const eventRoutes = require('./routes/events');
const activityRoutes = require('./routes/activities');
const whatWeDoRoutes = require('./routes/whatWeDo');
const donationRoutes = require('./routes/donations');
const seedDatabaseIfEmpty = require('./seeds/seedAll');

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
app.use(express.static(path.join(__dirname, '..', 'user-side')));
app.use(express.static(path.join(__dirname, '..')));

// MongoDB Atlas Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || MONGODB_URI.includes('<username>')) {
  console.warn('⚠️ WARNING: MONGODB_URI is not configured in backend/.env. Please update it with your MongoDB Atlas connection string.');
} else {
  mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  })
    .then(async () => {
      console.log('✅ Connected to MongoDB Atlas successfully!');
      // Run automatic initialization seed if collections are empty
      await seedDatabaseIfEmpty();
    })
    .catch((err) => {
      console.error('❌ MongoDB Atlas Connection Error:', err.message);
      console.log('💡 To fix this: Go to MongoDB Atlas -> Security -> Network Access -> Add IP Address -> Select "Allow Access From Anywhere (0.0.0.0/0)" or add your current IP.');
    });
}

// API Routes
app.use('/api/contact', contactRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/what-we-do', whatWeDoRoutes);
app.use('/api/donations', donationRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  const isResendConfigured = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_your_resend_api_key_here');
  res.status(200).json({
    status: 'OK',
    service: 'Jayasri Kannan Foundation API',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    resendConfigured: isResendConfigured
  });
});

// Development / Debugging Test Endpoint for Resend Email
app.get('/api/test-resend', async (req, res) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === 're_your_resend_api_key_here' || apiKey.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'RESEND_API_KEY is not configured in backend/.env file.'
    });
  }

  try {
    const { Resend } = require('resend');
    const resend = new Resend(apiKey.trim());
    const adminEmail = process.env.ADMIN_EMAIL || 'jskfoundation29@gmail.com';
    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';

    const { data, error } = await resend.emails.send({
      from: `Jayasri Kannan Foundation <${fromEmail}>`,
      to: [adminEmail],
      subject: '[Test] Resend Email Integration Test',
      html: '<p>This is a test email sent from Jayasri Kannan Foundation backend API.</p>'
    });

    if (error) {
      return res.status(500).json({ success: false, error });
    }

    return res.status(200).json({
      success: true,
      message: `Test email sent successfully to ${adminEmail}!`,
      data
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Fallback to index.html for non-API GET routes (Express 5 compatible)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, '..', 'index.html'));
  }
  next();
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
  const isResendConfigured = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_your_resend_api_key_here');
  console.log(`🚀 Jayasri Kannan Foundation Backend API running on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`📬 Contact API: http://localhost:${PORT}/api/contact (POST)`);
  console.log(`🤝 Volunteer API: http://localhost:${PORT}/api/volunteers (POST)`);
  console.log(`📧 RESEND_API_KEY loaded: ${isResendConfigured ? 'YES' : 'NO'}`);
});
