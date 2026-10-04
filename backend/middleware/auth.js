const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'jsk_foundation_super_secret_jwt_key_2026_atlas_secure';

/**
 * Authentication Middleware
 * Validates the JWT Bearer token from the Authorization header.
 * Allows dev fallback token if MongoDB was offline during login.
 */
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. No authentication token provided.'
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired session token. Please log in again.'
    });
  }
};
