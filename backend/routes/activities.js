const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const auth = require('../middleware/auth');

// Public
router.get('/', activityController.getAllActivities);
router.get('/active-slot', activityController.getActiveSlot);

// Admin Protected
router.post('/', auth, activityController.createActivity);
router.put('/:id', auth, activityController.updateActivity);
router.put('/:id/set-slot', auth, activityController.setActiveSlot);
router.delete('/:id', auth, activityController.deleteActivity);

module.exports = router;
