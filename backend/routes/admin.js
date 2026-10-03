const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// POST /api/admin/login
router.post('/login', adminController.adminLogin);

// GET /api/admin/verify - verify JWT token
router.get('/verify', adminController.verifyToken);

module.exports = router;
