const Contact = require('../models/Contact');
const { Resend } = require('resend');

// Initialize Resend if API key is provided
const resend = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_your_resend_api_key_here'
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

/**
 * Handle new contact form submission
 * POST /api/contact
 */
exports.createContact = async (req, res) => {
  try {
    const { fullName, mobile, email, organisation, subject, message } = req.body;

    // Server-side Validation
    if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
      return res.status(400).json({ success: false, error: 'Full Name is required.' });
    }
    if (!mobile || typeof mobile !== 'string' || !mobile.trim()) {
      return res.status(400).json({ success: false, error: 'Mobile Number is required.' });
    }
    if (!subject || typeof subject !== 'string' || !subject.trim()) {
      return res.status(400).json({ success: false, error: 'Subject is required.' });
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message is required.' });
    }

    // Basic Mobile Number Sanity Check
    const cleanMobile = mobile.trim();
    if (cleanMobile.length < 7 || cleanMobile.length > 15) {
      return res.status(400).json({ success: false, error: 'Please enter a valid mobile number.' });
    }

    // 1. Save submission to MongoDB
    const contactData = {
      fullName: fullName.trim(),
      mobile: cleanMobile,
      email: email ? email.trim() : '',
      organisation: organisation ? organisation.trim() : '',
      subject: subject.trim(),
      message: message.trim(),
      status: 'new'
    };

    const savedContact = await Contact.create(contactData);

    // 2. Send Email Notification to Admin via Resend
    let emailSent = false;
    const adminEmail = process.env.ADMIN_EMAIL || 'jskfoundation29@gmail.com';

    if (resend) {
      try {
        const submissionDate = new Date(savedContact.createdAt).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'full',
          timeStyle: 'short'
        });

        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #1a3a6e; color: #ffffff; padding: 20px; text-align: center;">
              <h2 style="margin: 0; font-size: 22px;">Jayasri Kannan Foundation</h2>
              <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">New Website Contact Enquiry</p>
            </div>
            <div style="padding: 24px; color: #333333; background-color: #ffffff;">
              <p style="font-size: 15px;">A new message has been received from the website contact form.</p>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; width: 140px;">Full Name:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${savedContact.fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold;">Mobile:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee;"><a href="tel:${savedContact.mobile}">${savedContact.mobile}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold;">Email:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${savedContact.email ? `<a href="mailto:${savedContact.email}">${savedContact.email}</a>` : 'Not provided'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold;">Organisation:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${savedContact.organisation || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold;">Subject:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee;"><span style="background: #e8f4fd; color: #1a3a6e; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${savedContact.subject}</span></td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold;">Message:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; white-space: pre-wrap;">${savedContact.message}</td>
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
          subject: `[Contact Form] ${savedContact.subject} - ${savedContact.fullName}`,
          html: htmlContent
        });

        emailSent = true;
      } catch (emailErr) {
        console.error('Error sending email via Resend:', emailErr.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you for your message! We will get back to you shortly.',
      data: {
        id: savedContact._id,
        fullName: savedContact.fullName,
        emailSent
      }
    });
  } catch (error) {
    console.error('Error in createContact:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing your message. Please try again.'
    });
  }
};

/**
 * Get all contacts (for future admin dashboard)
 * GET /api/contact
 */
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: contacts.length, data: contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return res.status(500).json({ success: false, error: 'Failed to retrieve contacts' });
  }
};
