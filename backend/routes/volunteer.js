const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');

const auth = require('../middleware/auth');

// POST /api/volunteers - Submit volunteer registration (Public)
router.post('/', volunteerController.createVolunteer);

// GET /api/volunteers - Retrieve all volunteer registrations (Admin Protected)
router.get('/', auth, volunteerController.getAllVolunteers);

module.exports = router;
