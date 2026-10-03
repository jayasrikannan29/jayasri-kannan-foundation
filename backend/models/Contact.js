const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full Name is required'],
      trim: true
    },
    mobile: {
      type: String,
      required: [true, 'Mobile Number is required'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    organisation: {
      type: String,
      trim: true,
      default: ''
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true
    },
    status: {
      type: String,
      enum: ['new', 'read', 'responded', 'archived'],
      default: 'new'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Contact', contactSchema);
