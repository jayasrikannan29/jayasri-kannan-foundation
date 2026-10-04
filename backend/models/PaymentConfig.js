const mongoose = require('mongoose');

const paymentConfigSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'primary_qr'
    },
    title: {
      type: String,
      default: 'SBI Official Scan & Pay'
    },
    upiId: {
      type: String,
      default: '7010964630@sbi'
    },
    bankName: {
      type: String,
      default: 'State Bank of India (SBI)'
    },
    accountHolder: {
      type: String,
      default: 'Jayasri Kannan Foundation'
    },
    accountNumber: {
      type: String,
      default: ''
    },
    ifscCode: {
      type: String,
      default: ''
    },
    qrImageData: {
      type: String, // Base64 data URI (e.g. data:image/jpeg;base64,...)
      required: true
    },
    contentType: {
      type: String,
      default: 'image/jpeg'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PaymentConfig', paymentConfigSchema);
