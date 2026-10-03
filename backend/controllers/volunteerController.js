const mongoose = require('mongoose');
const Volunteer = require('../models/Volunteer');
const { Resend } = require('resend');

// Initialize Resend if API key is provided
const resend = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_your_resend_api_key_here'
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

/**
 * Handle new volunteer application form submission
 * POST /api/volunteers
 */
exports.createVolunteer = async (req, res) => {
  try {
    const { fullName, mobile, email, location, ageGroup, areaOfInterest, profession, message } = req.body;

    // Server-side Validation
    if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
      return res.status(400).json({ success: false, error: 'Full Name is required.' });
    }
    if (!mobile || typeof mobile !== 'string' || !mobile.trim()) {
      return res.status(400).json({ success: false, error: 'Mobile Number is required.' });
    }
    if (!location || typeof location !== 'string' || !location.trim()) {
      return res.status(400).json({ success: false, error: 'Location / City is required.' });
    }
    if (!areaOfInterest || typeof areaOfInterest !== 'string' || !areaOfInterest.trim()) {
      return res.status(400).json({ success: false, error: 'Area of Interest is required.' });
    }

    const cleanMobile = mobile.trim();
    if (cleanMobile.length < 7 || cleanMobile.length > 15) {
      return res.status(400).json({ success: false, error: 'Please enter a valid mobile number.' });
    }

    // 1. Save submission to MongoDB with status 'new'
    const volunteerData = {
      fullName: fullName.trim(),
      mobile: cleanMobile,
      email: email ? email.trim() : '',
      location: location.trim(),
      ageGroup: ageGroup ? ageGroup.trim() : '',
      areaOfInterest: areaOfInterest.trim(),
      profession: profession ? profession.trim() : '',
      message: message ? message.trim() : '',
      status: 'new'
    };

    const savedVolunteer = await Volunteer.create(volunteerData);

    // 2. Send Email Notification to Admin via Resend
    let emailSent = false;
    const adminEmail = process.env.ADMIN_EMAIL || 'jskfoundation29@gmail.com';

    if (resend) {
      try {
        const submissionDate = new Date(savedVolunteer.createdAt).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'full',
          timeStyle: 'short'
        });

        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #1a3a6e; color: #ffffff; padding: 20px; text-align: center;">
              <h2 style="margin: 0; font-size: 22px;">Jayasri Kannan Foundation</h2>
              <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">New Volunteer Application Received</p>
            </div>
            <div style="padding: 24px; color: #333333; background-color: #ffffff;">
              <p style="font-size: 15px;">A new volunteer registration has been submitted on the website.</p>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; width: 140px;">Full Name:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${savedVolunteer.fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold;">Mobile:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee;"><a href="tel:${savedVolunteer.mobile}">${savedVolunteer.mobile}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold;">Email:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${savedVolunteer.email ? `<a href="mailto:${savedVolunteer.email}">${savedVolunteer.email}</a>` : 'Not provided'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold;">Location / City:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${savedVolunteer.location}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold;">Age Group:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${savedVolunteer.ageGroup || 'Not specified'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold;">Area of Interest:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee;"><span style="background: #e8f4fd; color: #1a3a6e; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${savedVolunteer.areaOfInterest}</span></td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold;">Profession:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${savedVolunteer.profession || 'Not specified'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold;">Message/Notes:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; white-space: pre-wrap;">${savedVolunteer.message || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold;">Status:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee;"><span style="background: #e6f4ea; color: #137333; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${savedVolunteer.status}</span></td>
                </tr>
                <tr>
                  <td style="padding: 10px; font-weight: bold;">Date & Time:</td>
                  <td style="padding: 10px;">${submissionDate}</td>
                </tr>
              </table>
            </div>
            <div style="background-color: #f9f9f9; padding: 12px 20px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #eeeeee;">
              Jayasri Kannan Foundation • Automated System Notification
            </div>
          </div>
        `;

        await resend.emails.send({
          from: 'Jayasri Kannan Foundation <onboarding@resend.dev>',
          to: [adminEmail],
          subject: `[Volunteer Reg] ${savedVolunteer.areaOfInterest} - ${savedVolunteer.fullName} (${savedVolunteer.location})`,
          html: htmlContent
        });

        emailSent = true;
      } catch (emailErr) {
        console.error('Error sending volunteer email via Resend:', emailErr.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you for registering as a volunteer! We will contact you soon about opportunities to serve.',
      data: {
        id: savedVolunteer._id,
        fullName: savedVolunteer.fullName,
        emailSent
      }
    });
  } catch (error) {
    console.error('Error in createVolunteer:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while registering. Please try again.'
    });
  }
};

/**
 * Get all volunteers (for future admin dashboard / management)
 * GET /api/volunteers
 */
exports.getAllVolunteers = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ success: true, count: 0, data: [], note: 'Database offline or IP not whitelisted in Atlas' });
    }
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: volunteers.length, data: volunteers });
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    return res.status(500).json({ success: false, error: 'Failed to retrieve volunteers' });
  }
};
