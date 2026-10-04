const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const auth = require('../middleware/auth');

// Public - submit donation record (Step 1)
router.post('/', donationController.createDonation);

// Public - update transaction reference after scanning QR (Step 2)
router.patch('/:id/transaction', donationController.updateTransaction);

// Public - get official QR code safely retrieved from database
router.get('/qr', donationController.getQrCode);

// Admin Protected
router.get('/', auth, donationController.getAllDonations);
router.post('/qr', auth, donationController.updateQrCode);
router.put('/:id/status', auth, donationController.updateStatus);
router.delete('/:id', auth, donationController.deleteDonation);

module.exports = router;
