const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true
    },
    category: {
      type: String,
      enum: ['Health & Medical', 'Eye Care', 'Blood Donation', 'Education', 'Social Welfare', 'Celebration / Memorial'],
      default: 'Health & Medical'
    },
    status: {
      type: String,
      enum: ['Upcoming', 'In Progress', 'Completed'],
      default: 'Upcoming'
    },
    date: {
      type: String,
      required: [true, 'Event date is required']
    },
    time: {
      type: String,
      default: '09:00 AM - 02:00 PM'
    },
    venue: {
      type: String,
      required: [true, 'Venue / Location is required'],
      trim: true
    },
    desc: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    image: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
