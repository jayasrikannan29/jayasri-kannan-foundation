const fs = require('fs');
const path = require('path');
const Event = require('../models/Event');
const Activity = require('../models/Activity');
const WhatWeDo = require('../models/WhatWeDo');
const Donation = require('../models/Donation');
const Gallery = require('../models/Gallery');
const PaymentConfig = require('../models/PaymentConfig');

const DEFAULT_EVENTS = [
  {
    title: 'Free Mega Eye Screening & Cataract Consultation Camp',
    category: 'Eye Care',
    date: '2026-10-18',
    time: '09:00 AM - 02:00 PM',
    venue: 'Ambattur Community Hall, Chennai',
    desc: 'Comprehensive eye examinations, blood sugar screening, free spectacle distributions, and referral surgeries for senior citizens.',
    status: 'Upcoming',
    image: 'images/eye/eye1.jpeg'
  },
  {
    title: 'Emergency Blood Donation & Awareness Drive',
    category: 'Blood Donation',
    date: '2026-09-22',
    time: '08:30 AM - 01:30 PM',
    venue: 'Government Kilpauk Medical College, Chennai',
    desc: 'Organized in collaboration with state blood transfusion councils, collecting 120+ units of emergency blood reserves.',
    status: 'Completed',
    image: 'images/Blood/Blood1.jpeg'
  },
  {
    title: 'Educational Kit & Student Scholarship Distribution',
    category: 'Education',
    date: '2026-08-15',
    time: '10:00 AM - 01:00 PM',
    venue: 'Thiruvallur District Govt Higher Secondary School',
    desc: 'Distributed academic starter kits, textbooks, and merit bursaries to over 150 students from underprivileged backgrounds.',
    status: 'Completed',
    image: 'images/event01.jpeg'
  },
  {
    title: 'Comprehensive Rural Healthcare & Diagnostic Camp',
    category: 'Health & Medical',
    date: '2026-07-10',
    time: '09:00 AM - 03:00 PM',
    venue: 'Poonamallee Rural Health Center',
    desc: 'Multi-specialty primary health checkups, vitals evaluation, blood sugar tests, and distribution of essential medicines.',
    status: 'Completed',
    image: 'images/health/Health.jpeg'
  }
];

const DEFAULT_ACTIVITIES = [
  {
    title: 'Mega Rural Health & Eye Screening Camp',
    category: 'Healthcare Outreach',
    date: '2026-10-28',
    location: 'Ambattur Community Hall, Chennai',
    target: '500+ Beneficiaries',
    desc: 'Scheduled community drive providing complimentary general physician consultations, ECG, blood pressure tests, and free cataract triage.',
    isSlot: true
  },
  {
    title: 'Education Kit & Uniform Distribution Drive',
    category: 'Education Support',
    date: '2026-11-15',
    location: 'Government High School, Thiruvallur District',
    target: '250 Students',
    desc: 'Distributing school kits comprising bags, geometry sets, notebook bundles, and school uniforms for rural students.',
    isSlot: false
  },
  {
    title: 'Community Tree Plantation & Green Belt Initiative',
    category: 'Social Welfare',
    date: '2026-12-05',
    location: 'Ambattur Industrial Estate Vicinity',
    target: '1000 Saplings',
    desc: 'Empowering local youth and community volunteers to plant shade-giving and fruit saplings for neighborhood green cover.',
    isSlot: false
  }
];

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


async function seedDatabaseIfEmpty() {
  try {
    // 1. Events
    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      await Event.insertMany(DEFAULT_EVENTS);
      console.log('🌱 Seeded default Events into MongoDB Atlas');
    }

    // 2. Activities
    const activityCount = await Activity.countDocuments();
    if (activityCount === 0) {
      await Activity.insertMany(DEFAULT_ACTIVITIES);
      console.log('🌱 Seeded default Activities into MongoDB Atlas');
    }

    // 3. What We Do Pillars
    const whatWeDoCount = await WhatWeDo.countDocuments();
    if (whatWeDoCount === 0) {
      await WhatWeDo.insertMany(DEFAULT_PILLARS);
      console.log('🌱 Seeded default What We Do pillars into MongoDB Atlas');
    }

    // 4. Donations are left at 0 real records (ready for live payment integration)

    // 5. Payment QR Code Configuration (stored safely in MongoDB Atlas)
    const qrConfig = await PaymentConfig.findOne({ key: 'primary_qr' });
    if (!qrConfig || !qrConfig.qrImageData) {
      const localQrPath = path.join(__dirname, '..', '..', 'user-side', 'images', 'sbi-qr-scanner.jpg');
      if (fs.existsSync(localQrPath)) {
        const fileBuf = fs.readFileSync(localQrPath);
        const base64Data = 'data:image/jpeg;base64,' + fileBuf.toString('base64');
        await PaymentConfig.findOneAndUpdate(
          { key: 'primary_qr' },
          {
            key: 'primary_qr',
            title: 'SBI Official Scan & Pay',
            upiId: '7010964630@sbi',
            bankName: 'State Bank of India (SBI)',
            accountHolder: 'Jayasri Kannan Foundation',
            qrImageData: base64Data,
            contentType: 'image/jpeg'
          },
          { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
        );
        console.log('🌱 Seeded Official SBI QR Code safely into MongoDB Atlas');
      }
    }
  } catch (err) {
    console.warn('⚠️ Seeding note:', err.message);
  }
}

module.exports = seedDatabaseIfEmpty;
