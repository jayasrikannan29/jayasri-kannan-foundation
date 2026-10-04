const WhatWeDo = require('../models/WhatWeDo');

const DEFAULT_PILLARS = [
  {
    slug: 'healthcare',
    icon: 'fa-solid fa-stethoscope',
    color: '#1a3a6e',
    bg: 'rgba(26,58,110,0.1)',
    title: 'Healthcare Outreach',
    desc: 'Free general health checkups, vitals monitoring, specialist consultations, and essential medicine distribution for underprivileged families in rural and suburban belts.',
    order: 1
  },
  {
    slug: 'eyecare',
    icon: 'fa-solid fa-eye',
    color: '#c9a227',
    bg: 'rgba(201,162,39,0.12)',
    title: 'Free Eye Examination Camps',
    desc: 'Comprehensive vision tests, free prescription glasses distribution, and cataract identification camps in collaboration with leading ophthalmic hospitals.',
    order: 2
  },
  {
    slug: 'blooddonation',
    icon: 'fa-solid fa-droplet',
    color: '#e53935',
    bg: 'rgba(229,57,53,0.1)',
    title: 'Emergency Blood Donation Drives',
    desc: 'Voluntary blood donor rallies, immediate donor coordination with government blood banks, and critical blood requirement matching for emergency patient care.',
    order: 3
  },
  {
    slug: 'education',
    icon: 'fa-solid fa-graduation-cap',
    color: '#2e8b57',
    bg: 'rgba(46,139,87,0.1)',
    title: 'Education & Scholarship Support',
    desc: 'Financial scholarships, school bags, notebooks, uniforms, and mentorship support for bright children from low-income households.',
    order: 4
  },
  {
    slug: 'welfare',
    icon: 'fa-solid fa-people-group',
    color: '#1a3a6e',
    bg: 'rgba(26,58,110,0.1)',
    title: 'Social Welfare & Community Relief',
    desc: 'Disaster and seasonal ration distribution, women self-help skill empowerment, senior citizen care, and tree plantation drives across Tamil Nadu.',
    order: 5
  }
];

/**
 * GET /api/what-we-do
 * Public: Retrieve all What We Do service pillars
 */
exports.getAllPillars = async (req, res) => {
  try {
    let pillars = await WhatWeDo.find().sort({ order: 1 });
    if (!pillars || pillars.length === 0) {
      pillars = await WhatWeDo.insertMany(DEFAULT_PILLARS);
    }
    return res.status(200).json({
      success: true,
      count: pillars.length,
      data: pillars
    });
  } catch (error) {
    console.error('Error in getAllPillars:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch service pillars.' });
  }
};

/**
 * PUT /api/what-we-do/batch
 * Admin Protected: Update all or multiple service cards in one request
 */
exports.batchUpdatePillars = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, error: 'Items array is required.' });
    }

    const updated = [];
    for (const item of items) {
      if (item._id) {
        const doc = await WhatWeDo.findByIdAndUpdate(
          item._id,
          {
            title: item.title,
            desc: item.desc,
            icon: item.icon,
            color: item.color,
            bg: item.bg,
            order: item.order
          },
          { new: true }
        );
        if (doc) updated.push(doc);
      } else if (item.slug) {
        const doc = await WhatWeDo.findOneAndUpdate(
          { slug: item.slug },
          item,
          { new: true, upsert: true }
        );
        updated.push(doc);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Service cards updated successfully.',
      data: updated
    });
  } catch (error) {
    console.error('Error in batchUpdatePillars:', error);
    return res.status(500).json({ success: false, error: 'Failed to update service cards.' });
  }
};

/**
 * POST /api/what-we-do/reset
 * Admin Protected: Reset service cards to factory defaults
 */
exports.resetDefaults = async (req, res) => {
  try {
    await WhatWeDo.deleteMany({});
    const created = await WhatWeDo.insertMany(DEFAULT_PILLARS);
    return res.status(200).json({
      success: true,
      message: 'Service pillars reset to defaults.',
      data: created
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to reset service pillars.' });
  }
};
