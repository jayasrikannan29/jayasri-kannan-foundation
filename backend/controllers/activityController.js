const Activity = require('../models/Activity');

/**
 * GET /api/activities
 * Public: List all scheduled and past activities
 */
exports.getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ isSlot: -1, date: -1 });
    return res.status(200).json({
      success: true,
      count: activities.length,
      data: activities
    });
  } catch (error) {
    console.error('Error in getAllActivities:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch activities.' });
  }
};

/**
 * GET /api/activities/active-slot
 * Public: Retrieve currently highlighted next activity slot for public banner
 */
exports.getActiveSlot = async (req, res) => {
  try {
    let slot = await Activity.findOne({ isSlot: true });
    if (!slot) {
      slot = await Activity.findOne().sort({ date: -1 });
    }
    return res.status(200).json({
      success: true,
      data: slot
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch active slot.' });
  }
};

/**
 * POST /api/activities
 * Admin Protected: Create a new activity
 */
exports.createActivity = async (req, res) => {
  try {
    const { title, category, date, location, target, desc, isSlot } = req.body;

    if (!title || !date || !location || !desc) {
      return res.status(400).json({
        success: false,
        error: 'Title, date, location, and description are required.'
      });
    }

    // If marked as active slot, unset any existing slot first
    if (isSlot) {
      await Activity.updateMany({}, { isSlot: false });
    }

    const activity = await Activity.create({
      title: title.trim(),
      category: category ? category.trim() : 'Healthcare Outreach',
      date: date.trim(),
      location: location.trim(),
      target: target ? target.trim() : 'Community Members',
      desc: desc.trim(),
      isSlot: !!isSlot
    });

    return res.status(201).json({
      success: true,
      message: 'Activity scheduled successfully.',
      data: activity
    });
  } catch (error) {
    console.error('Error in createActivity:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to create activity.' });
  }
};

/**
 * PUT /api/activities/:id
 * Admin Protected: Update activity
 */
exports.updateActivity = async (req, res) => {
  try {
    const { title, category, date, location, target, desc, isSlot } = req.body;

    if (isSlot) {
      await Activity.updateMany({ _id: { $ne: req.params.id } }, { isSlot: false });
    }

    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      {
        title: title?.trim(),
        category: category?.trim(),
        date: date?.trim(),
        location: location?.trim(),
        target: target?.trim(),
        desc: desc?.trim(),
        isSlot: isSlot !== undefined ? !!isSlot : undefined
      },
      { new: true, runValidators: true }
    );

    if (!activity) {
      return res.status(404).json({ success: false, error: 'Activity not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Activity updated successfully.',
      data: activity
    });
  } catch (error) {
    console.error('Error in updateActivity:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to update activity.' });
  }
};

/**
 * PUT /api/activities/:id/set-slot
 * Admin Protected: Promote an activity to live highlighted slot
 */
exports.setActiveSlot = async (req, res) => {
  try {
    await Activity.updateMany({}, { isSlot: false });
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      { isSlot: true },
      { new: true }
    );

    if (!activity) {
      return res.status(404).json({ success: false, error: 'Activity not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Activity slot highlighted successfully.',
      data: activity
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to set active slot.' });
  }
};

/**
 * DELETE /api/activities/:id
 * Admin Protected: Delete activity
 */
exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) {
      return res.status(404).json({ success: false, error: 'Activity not found.' });
    }
    return res.status(200).json({
      success: true,
      message: 'Activity deleted successfully.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to delete activity.' });
  }
};
