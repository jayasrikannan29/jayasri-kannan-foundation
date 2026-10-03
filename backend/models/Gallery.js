const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Media name is required'],
      trim: true
    },
    type: {
      type: String,
      enum: ['image', 'video'],
      default: 'image'
    },
    url: {
      type: String,
      required: [true, 'Media URL is required'],
      trim: true
    },
    album: {
      type: String,
      trim: true,
      default: 'General'
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0]
    },
    location: {
      type: String,
      trim: true,
      default: ''
    },
    albumDesc: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Gallery', gallerySchema);
