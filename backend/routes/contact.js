const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

const auth = require('../middleware/auth');

// POST /api/contact - Submit contact message (Public)
router.post('/', contactController.createContact);

// GET /api/contact - Retrieve all contact messages (Admin Protected)
router.get('/', auth, contactController.getAllContacts);

module.exports = router;
