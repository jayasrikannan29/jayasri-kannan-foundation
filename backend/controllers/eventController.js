const Event = require('../models/Event');

/**
 * GET /api/events
 * Public: Retrieve all events (sorted by date ascending/descending)
 */
exports.getAllEvents = async (req, res) => {
  try {
    const { category, status } = req.query;
    const filter = {};
    if (category && category !== 'all') filter.category = category;
    if (status && status !== 'all') filter.status = status;

    const events = await Event.find(filter).sort({ date: -1, createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Error in getAllEvents:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch events.' });
  }
};

/**
 * GET /api/events/:id
 * Public: Get single event
 */
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found.' });
    }
    return res.status(200).json({ success: true, data: event });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve event.' });
  }
};

/**
 * POST /api/events
 * Admin Protected: Create a new event
 */
exports.createEvent = async (req, res) => {
  try {
    const { title, category, status, date, time, venue, desc, image } = req.body;

    if (!title || !date || !venue || !desc) {
      return res.status(400).json({
        success: false,
        error: 'Title, date, venue, and description are required.'
      });
    }

    const event = await Event.create({
      title: title.trim(),
      category: category || 'Health & Medical',
      status: status || 'Upcoming',
      date: date.trim(),
      time: time ? time.trim() : '09:00 AM - 02:00 PM',
      venue: venue.trim(),
      desc: desc.trim(),
      image: image ? image.trim() : ''
    });

    return res.status(201).json({
      success: true,
      message: 'Event created successfully.',
      data: event
    });
  } catch (error) {
    console.error('Error in createEvent:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to create event.' });
  }
};

/**
 * PUT /api/events/:id
 * Admin Protected: Update an existing event
 */
exports.updateEvent = async (req, res) => {
  try {
    const { title, category, status, date, time, venue, desc, image } = req.body;

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title: title?.trim(),
        category,
        status,
        date: date?.trim(),
        time: time?.trim(),
        venue: venue?.trim(),
        desc: desc?.trim(),
        image: image?.trim()
      },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Event updated successfully.',
      data: event
    });
  } catch (error) {
    console.error('Error in updateEvent:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to update event.' });
  }
};

/**
 * DELETE /api/events/:id
 * Admin Protected: Remove an event
 */
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found.' });
    }
    return res.status(200).json({
      success: true,
      message: 'Event deleted successfully.'
    });
  } catch (error) {
    console.error('Error in deleteEvent:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete event.' });
  }
};
