const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema(
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
    location: {
      type: String,
      required: [true, 'Location / City is required'],
      trim: true
    },
    ageGroup: {
      type: String,
      trim: true,
      default: ''
    },
    areaOfInterest: {
      type: String,
      required: [true, 'Area of Interest is required'],
      trim: true
    },
    profession: {
      type: String,
      trim: true,
      default: ''
    },
    message: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'approved', 'rejected'],
      default: 'new'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Volunteer', volunteerSchema);
