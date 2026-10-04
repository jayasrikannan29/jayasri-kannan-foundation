const express = require('express');
const router = express.Router();
const whatWeDoController = require('../controllers/whatWeDoController');
const auth = require('../middleware/auth');

// Public
router.get('/', whatWeDoController.getAllPillars);

// Admin Protected
router.put('/batch', auth, whatWeDoController.batchUpdatePillars);
router.post('/reset', auth, whatWeDoController.resetDefaults);

module.exports = router;
