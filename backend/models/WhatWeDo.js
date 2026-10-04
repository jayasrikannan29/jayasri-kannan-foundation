const mongoose = require('mongoose');

const whatWeDoSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    icon: {
      type: String,
      default: 'fa-solid fa-heart'
    },
    color: {
      type: String,
      default: '#1a3a6e'
    },
    bg: {
      type: String,
      default: 'rgba(26,58,110,0.1)'
    },
    title: {
      type: String,
      required: [true, 'Pillar title is required'],
      trim: true
    },
    desc: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('WhatWeDo', whatWeDoSchema);
