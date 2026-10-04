const Donation = require('../models/Donation');
const PaymentConfig = require('../models/PaymentConfig');

/**
 * POST /api/donations
 * Public: Submit a donation record or transaction notification
 */
exports.createDonation = async (req, res) => {
  try {
    const { name, phone, email, pan, amount, txnId, cause, paymentMethod, notes } = req.body;

    if (!name || !phone || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Donor name, phone number, and donation amount are required.'
      });
    }

    const donation = await Donation.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : '',
      pan: pan ? pan.trim().toUpperCase() : '',
      amount: Number(amount),
      txnId: txnId ? txnId.trim() : '',
      cause: cause ? cause.trim() : 'General Foundation Fund',
      paymentMethod: paymentMethod || 'UPI',
      status: 'Pending',
      notes: notes ? notes.trim() : ''
    });

    return res.status(201).json({
      success: true,
      message: 'Donation notification submitted successfully. Thank you for your support!',
      data: donation
    });
  } catch (error) {
    console.error('Error in createDonation:', error);
    return res.status(500).json({ success: false, error: 'Failed to record donation.' });
  }
};

/**
 * GET /api/donations
 * Admin Protected: Retrieve all donation records
 */
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: donations.length,
      data: donations
    });
  } catch (error) {
    console.error('Error in getAllDonations:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch donation records.' });
  }
};

/**
 * PUT /api/donations/:id/status
 * Admin Protected: Update verification status
 */
exports.updateStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      {
        ...(status && { status }),
        ...(notes !== undefined && { notes })
      },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({ success: false, error: 'Donation record not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Donation record updated successfully.',
      data: donation
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to update donation status.' });
  }
};

/**
 * DELETE /api/donations/:id
 * Admin Protected: Delete a donation entry
 */
exports.deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, error: 'Donation record not found.' });
    }
    return res.status(200).json({
      success: true,
      message: 'Donation record deleted.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to delete donation.' });
  }
};

/**
 * GET /api/donations/qr
 * Public: Retrieve official QR code image stored in MongoDB Atlas
 * Supports direct image streaming (<img src="/api/donations/qr">) or JSON response
 */
exports.getQrCode = async (req, res) => {
  try {
    const config = await PaymentConfig.findOne({ key: 'primary_qr' });
    if (!config || !config.qrImageData) {
      return res.status(404).json({ success: false, error: 'QR Code not found in database.' });
    }

    // Return JSON if requested explicitly via ?format=json or Accept: application/json
    if (req.query.format === 'json' || (req.headers.accept && req.headers.accept.includes('application/json'))) {
      return res.status(200).json({
        success: true,
        data: {
          key: config.key,
          title: config.title,
          upiId: config.upiId,
          bankName: config.bankName,
          accountHolder: config.accountHolder,
          accountNumber: config.accountNumber,
          ifscCode: config.ifscCode,
          qrImageData: config.qrImageData
        }
      });
    }

    // Serve raw image buffer directly from MongoDB
    const matches = config.qrImageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const mimeType = matches[1];
      const buffer = Buffer.from(matches[2], 'base64');
      res.set('Content-Type', mimeType);
      res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24h
      return res.send(buffer);
    }

    return res.status(400).json({ success: false, error: 'Invalid QR image format in database.' });
  } catch (error) {
    console.error('Error fetching QR code from database:', error);
    return res.status(500).json({ success: false, error: 'Failed to retrieve QR code from database.' });
  }
};

/**
 * POST /api/donations/qr
 * Admin Protected: Store / Update Payment QR Code into MongoDB Atlas
 */
exports.updateQrCode = async (req, res) => {
  try {
    const { qrImageData, upiId, bankName, accountHolder, title } = req.body;
    if (!qrImageData) {
      return res.status(400).json({ success: false, error: 'qrImageData is required.' });
    }

    const config = await PaymentConfig.findOneAndUpdate(
      { key: 'primary_qr' },
      {
        $set: {
          ...(qrImageData && { qrImageData }),
          ...(upiId && { upiId }),
          ...(bankName && { bankName }),
          ...(accountHolder && { accountHolder }),
          ...(title && { title })
        }
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Payment QR code securely saved in MongoDB database.',
      data: {
        key: config.key,
        upiId: config.upiId,
        title: config.title
      }
    });
  } catch (error) {
    console.error('Error updating QR code in database:', error);
    return res.status(500).json({ success: false, error: 'Failed to save QR code into database.' });
  }
};
