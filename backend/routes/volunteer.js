const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');

// POST /api/volunteers - Submit volunteer registration
router.post('/', volunteerController.createVolunteer);

// GET /api/volunteers - Retrieve all volunteer registrations (Admin)
router.get('/', volunteerController.getAllVolunteers);

module.exports = router;
