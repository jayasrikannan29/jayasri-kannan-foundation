const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const JWT_SECRET = process.env.JWT_SECRET || 'jsk_foundation_super_secret_jwt_key_2026_atlas_secure';
const JWT_EXPIRES_IN = '8h';

/**
 * POST /api/admin/login
 * Authenticate admin credentials and return a JWT
 */
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Fallback: If MongoDB is disconnected (e.g. IP whitelist block on Atlas), allow fallback dummy admin
    if (mongoose.connection.readyState !== 1) {
      if (cleanEmail === 'admin@jskfoundation.org' && password === 'JSK@Admin2026!') {
        const token = jwt.sign(
          { id: 'fallback_admin_id', email: cleanEmail, role: 'super_admin', name: 'JSK Foundation Admin (Dev Mode)' },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN }
        );
        return res.status(200).json({
          success: true,
          message: 'Login successful (Dev Mode - MongoDB Disconnected)',
          token,
          admin: {
            id: 'fallback_admin_id',
            name: 'JSK Foundation Admin (Dev Mode)',
            email: cleanEmail,
            role: 'super_admin',
          },
        });
      }
      return res.status(503).json({
        success: false,
        error: 'Database connection offline. For Dev Mode, use email: admin@jskfoundation.org / pass: JSK@Admin2026!',
      });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email: email.trim().toLowerCase() });
    if (!admin) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    if (!admin.isActive) {
      return res.status(403).json({ success: false, error: 'Your account has been deactivated. Contact the system administrator.' });
    }

    // Verify password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    // Generate JWT
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role, name: admin.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ success: false, error: 'An internal server error occurred.' });
  }
};

/**
 * GET /api/admin/verify
 * Verify a JWT token (middleware check)
 */
exports.verifyToken = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.status(200).json({ success: true, admin: decoded });
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token. Please log in again.' });
  }
};
