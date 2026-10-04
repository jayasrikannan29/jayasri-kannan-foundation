const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Donor name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Donor phone number is required'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    pan: {
      type: String,
      trim: true,
      uppercase: true,
      default: ''
    },
    amount: {
      type: Number,
      required: [true, 'Donation amount is required']
    },
    txnId: {
      type: String,
      trim: true,
      default: ''
    },
    cause: {
      type: String,
      trim: true,
      default: 'General Foundation Fund'
    },
    paymentMethod: {
      type: String,
      trim: true,
      default: 'UPI'
    },
    status: {
      type: String,
      enum: ['Verified', 'Pending', 'Flagged'],
      default: 'Pending'
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);
