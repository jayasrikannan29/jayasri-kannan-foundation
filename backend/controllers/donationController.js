const Donation = require('../models/Donation');

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
