const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Activity title is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      default: 'Healthcare Outreach'
    },
    date: {
      type: String,
      required: [true, 'Date is required']
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    target: {
      type: String,
      default: 'Community Members',
      trim: true
    },
    desc: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    isSlot: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', activitySchema);
