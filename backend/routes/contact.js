const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// POST /api/contact - Submit contact message
router.post('/', contactController.createContact);

// GET /api/contact - Retrieve all contact messages (Admin)
router.get('/', contactController.getAllContacts);

module.exports = router;
