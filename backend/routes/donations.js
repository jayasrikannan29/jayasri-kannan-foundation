const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const auth = require('../middleware/auth');

// Public - submit donation record
router.post('/', donationController.createDonation);

// Public - get official QR code safely retrieved from database
router.get('/qr', donationController.getQrCode);

// Admin Protected
router.get('/', auth, donationController.getAllDonations);
router.post('/qr', auth, donationController.updateQrCode);
router.put('/:id/status', auth, donationController.updateStatus);
router.delete('/:id', auth, donationController.deleteDonation);

module.exports = router;
