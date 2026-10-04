const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Gallery = require('../models/Gallery');

const BACKUP_FILE = path.join(__dirname, '..', 'data_gallery.json');

const SEED_ITEMS = [
  // ── Community Service (Addon Image) ──────────────────────────────────
  { name: 'Community Service & Healthcare – 1', type: 'image', url: '/user-side/images/Addon Image/Addon Image.jpeg',  album: 'Community Service', date: '2026-09-26', location: 'Chennai', albumDesc: 'Community service and healthcare outreach.' },
  { name: 'Community Service & Healthcare – 2', type: 'image', url: '/user-side/images/Addon Image/Addon Image1.jpeg', album: 'Community Service', date: '2026-09-26', location: 'Chennai', albumDesc: 'Community service and healthcare outreach.' },
  { name: 'Community Service & Healthcare – 3', type: 'image', url: '/user-side/images/Addon Image/Addon Image2.jpeg', album: 'Community Service', date: '2026-09-26', location: 'Chennai', albumDesc: 'Community service and healthcare outreach.' },
  { name: 'Community Service & Healthcare – 4', type: 'image', url: '/user-side/images/Addon Image/Addon Image3.jpeg', album: 'Community Service', date: '2026-09-26', location: 'Chennai', albumDesc: 'Community service and healthcare outreach.' },
  { name: 'Community Service & Healthcare – 5', type: 'image', url: '/user-side/images/Addon Image/Addon Image4.jpeg', album: 'Community Service', date: '2026-09-26', location: 'Chennai', albumDesc: 'Community service and healthcare outreach.' },
  { name: 'Community Service & Healthcare – 6', type: 'image', url: '/user-side/images/Addon Image/Addon Image5.jpeg', album: 'Community Service', date: '2026-09-26', location: 'Chennai', albumDesc: 'Community service and healthcare outreach.' },
  { name: 'Community Service & Healthcare – 7', type: 'image', url: '/user-side/images/Addon Image/Addon Image6.jpeg', album: 'Community Service', date: '2026-09-26', location: 'Chennai', albumDesc: 'Community service and healthcare outreach.' },

  // ── Blood Donation Drive ─────────────────────────────────────────────
  { name: 'Blood Donation Drive – 1',  type: 'image', url: '/user-side/images/Blood/Blood1.jpeg',  album: 'Blood Donation Drive', date: '2026-09-22', location: 'Govt Medical College, Chennai', albumDesc: 'Voluntary blood donation and donor registry drive.' },
  { name: 'Blood Donation Drive – 2',  type: 'image', url: '/user-side/images/Blood/Blood2.jpeg',  album: 'Blood Donation Drive', date: '2026-09-22', location: 'Govt Medical College, Chennai', albumDesc: 'Voluntary blood donation and donor registry drive.' },
  { name: 'Blood Donation Drive – 3',  type: 'image', url: '/user-side/images/Blood/Blood3.jpeg',  album: 'Blood Donation Drive', date: '2026-09-22', location: 'Govt Medical College, Chennai', albumDesc: 'Voluntary blood donation and donor registry drive.' },
  { name: 'Blood Donation Drive – 4',  type: 'image', url: '/user-side/images/Blood/Blood4.jpeg',  album: 'Blood Donation Drive', date: '2026-09-22', location: 'Govt Medical College, Chennai', albumDesc: 'Voluntary blood donation and donor registry drive.' },
  { name: 'Blood Donation Drive – 5',  type: 'image', url: '/user-side/images/Blood/Blood5.jpeg',  album: 'Blood Donation Drive', date: '2026-09-22', location: 'Govt Medical College, Chennai', albumDesc: 'Voluntary blood donation and donor registry drive.' },
  { name: 'Blood Donation Drive – 6',  type: 'image', url: '/user-side/images/Blood/Blood6.jpeg',  album: 'Blood Donation Drive', date: '2026-09-22', location: 'Govt Medical College, Chennai', albumDesc: 'Voluntary blood donation and donor registry drive.' },
  { name: 'Blood Donation Drive – 7',  type: 'image', url: '/user-side/images/Blood/blood7.jpeg',  album: 'Blood Donation Drive', date: '2026-09-22', location: 'Govt Medical College, Chennai', albumDesc: 'Voluntary blood donation and donor registry drive.' },
  { name: 'Blood Donation Drive – 8',  type: 'image', url: '/user-side/images/Blood/Blood8.jpeg',  album: 'Blood Donation Drive', date: '2026-09-22', location: 'Govt Medical College, Chennai', albumDesc: 'Voluntary blood donation and donor registry drive.' },
  { name: 'Blood Donation Drive – 9',  type: 'image', url: '/user-side/images/Blood/Blood9.jpeg',  album: 'Blood Donation Drive', date: '2026-09-22', location: 'Govt Medical College, Chennai', albumDesc: 'Voluntary blood donation and donor registry drive.' },
  { name: 'Blood Donation Drive – 11', type: 'image', url: '/user-side/images/Blood/Blood11.jpeg', album: 'Blood Donation Drive', date: '2026-09-22', location: 'Govt Medical College, Chennai', albumDesc: 'Voluntary blood donation and donor registry drive.' },
  { name: 'Blood Donation Drive – 12', type: 'image', url: '/user-side/images/Blood/Blood12.jpeg', album: 'Blood Donation Drive', date: '2026-09-22', location: 'Govt Medical College, Chennai', albumDesc: 'Voluntary blood donation and donor registry drive.' },

  // ── Community Welfare ────────────────────────────────────────────────
  { name: 'Community Welfare Outreach – 1', type: 'image', url: '/user-side/images/community/community.jpeg',  album: 'Community Welfare', date: '2026-06-20', location: 'Chennai Suburban', albumDesc: 'Women empowerment and community relief drive.' },
  { name: 'Community Welfare Outreach – 2', type: 'image', url: '/user-side/images/community/community1.jpeg', album: 'Community Welfare', date: '2026-06-20', location: 'Chennai Suburban', albumDesc: 'Women empowerment and community relief drive.' },
  { name: 'Community Welfare Outreach – 3', type: 'image', url: '/user-side/images/community/community2.jpeg', album: 'Community Welfare', date: '2026-06-20', location: 'Chennai Suburban', albumDesc: 'Women empowerment and community relief drive.' },
  { name: 'Community Welfare Outreach – 4', type: 'image', url: '/user-side/images/community/community3.jpeg', album: 'Community Welfare', date: '2026-06-20', location: 'Chennai Suburban', albumDesc: 'Women empowerment and community relief drive.' },
  { name: 'Community Welfare Outreach – 5', type: 'image', url: '/user-side/images/community/community4.jpeg', album: 'Community Welfare', date: '2026-06-20', location: 'Chennai Suburban', albumDesc: 'Women empowerment and community relief drive.' },
  { name: 'Community Welfare Outreach – 6', type: 'image', url: '/user-side/images/community/community5.jpeg', album: 'Community Welfare', date: '2026-06-20', location: 'Chennai Suburban', albumDesc: 'Women empowerment and community relief drive.' },

  // ── Free Eye Camp ────────────────────────────────────────────────────
  { name: 'Free Eye Camp – Awareness Campaign',     type: 'image', url: '/user-side/images/eye/eye-camp-1.jpg', album: 'Free Eye Camp', date: '2026-10-18', location: 'Government High School, Chennai', albumDesc: 'Awareness campaign for child blindness and free eye camp.' },
  { name: 'Free Eye Camp – Dr. Jayasrikannan Team',  type: 'image', url: '/user-side/images/eye/eye-camp-2.jpg', album: 'Free Eye Camp', date: '2026-10-18', location: 'Government High School, Chennai', albumDesc: 'Computerized auto-refractor eye screening by foundation team.' },
  { name: 'Free Eye Camp – Vision Care Campaign',    type: 'image', url: '/user-side/images/eye/eye-camp-3.jpg', album: 'Free Eye Camp', date: '2026-10-18', location: 'Ambattur Community Hall, Chennai', albumDesc: 'Protect your sight, brighten your life vision screening.' },
  { name: 'Free Eye Camp – Student Vision Hall',     type: 'image', url: '/user-side/images/eye/eye-camp-4.jpg', album: 'Free Eye Camp', date: '2026-10-18', location: 'Government High School, Chennai', albumDesc: 'Comprehensive student vision assessment and trial frame testing.' },
  { name: 'Free Eye Camp – Trial Frame Testing',     type: 'image', url: '/user-side/images/eye/eye-camp-5.jpg', album: 'Free Eye Camp', date: '2026-10-18', location: 'Government High School, Chennai', albumDesc: 'Optometrist trial lens power adjustment for student.' },
  { name: 'Free Eye Camp – Student Vision Check',    type: 'image', url: '/user-side/images/eye/eye-camp-6.jpg', album: 'Free Eye Camp', date: '2026-10-18', location: 'Government High School, Chennai', albumDesc: 'Individual visual acuity monocular eye testing.' },
  { name: 'Free Eye Camp – Adult Blindness Camp',    type: 'image', url: '/user-side/images/eye/eye-camp-7.jpg', album: 'Free Eye Camp', date: '2026-10-18', location: 'Community Center, Chennai', albumDesc: 'Awareness campaign for adult blindness and eye camp checkup.' },
  { name: 'Free Eye Camp – Examination 1',       type: 'image', url: '/user-side/images/eye/eye1.jpeg', album: 'Free Eye Camp', date: '2026-10-18', location: 'Ambattur Community Hall, Chennai', albumDesc: 'Community eye screening and consultation camp.' },
  { name: 'Free Eye Camp – Examination 2',       type: 'image', url: '/user-side/images/eye/eye2.jpeg', album: 'Free Eye Camp', date: '2026-10-18', location: 'Ambattur Community Hall, Chennai', albumDesc: 'Community eye screening and consultation camp.' },
  { name: 'Free Eye Camp – Examination 3',       type: 'image', url: '/user-side/images/eye/eye3.jpeg', album: 'Free Eye Camp', date: '2026-10-18', location: 'Ambattur Community Hall, Chennai', albumDesc: 'Community eye screening and consultation camp.' },
  { name: 'Free Eye Camp – Glasses Distribution', type: 'image', url: '/user-side/images/eye/eye5.jpeg', album: 'Free Eye Camp', date: '2026-10-18', location: 'Ambattur Community Hall, Chennai', albumDesc: 'Community eye screening and consultation camp.' },
  { name: 'Free Eye Camp – Patient Consultation', type: 'image', url: '/user-side/images/eye/eye6.jpeg', album: 'Free Eye Camp', date: '2026-10-18', location: 'Ambattur Community Hall, Chennai', albumDesc: 'Community eye screening and consultation camp.' },
  { name: 'Free Eye Camp – Vision Testing 1',    type: 'image', url: '/user-side/images/eye/eye7.jpeg', album: 'Free Eye Camp', date: '2026-10-18', location: 'Ambattur Community Hall, Chennai', albumDesc: 'Community eye screening and consultation camp.' },
  { name: 'Free Eye Camp – Vision Testing 2',    type: 'image', url: '/user-side/images/eye/eye8.jpeg', album: 'Free Eye Camp', date: '2026-10-18', location: 'Ambattur Community Hall, Chennai', albumDesc: 'Community eye screening and consultation camp.' },
  { name: 'Free Eye Camp – Camp Highlights',     type: 'image', url: '/user-side/images/eye/eye9.jpeg', album: 'Free Eye Camp', date: '2026-10-18', location: 'Ambattur Community Hall, Chennai', albumDesc: 'Community eye screening and consultation camp.' },
  { name: 'Free Eye Camp – Video 1',             type: 'video', url: '/user-side/images/eye/eye4.mp4',  album: 'Free Eye Camp', date: '2026-10-18', location: 'Ambattur Community Hall, Chennai', albumDesc: 'Community eye screening and consultation camp.' },
  { name: 'Free Eye Camp – Video 2',             type: 'video', url: '/user-side/images/eye/eye10.mp4', album: 'Free Eye Camp', date: '2026-10-18', location: 'Ambattur Community Hall, Chennai', albumDesc: 'Community eye screening and consultation camp.' },

  // ── Rural Health Outreach ────────────────────────────────────────────
  { name: 'Rural Health Camp – Doctor Consultation',    type: 'image', url: '/user-side/images/health/Health.jpeg',  album: 'Rural Health Outreach', date: '2026-07-10', location: 'Poonamallee Health Center', albumDesc: 'Rural healthcare outreach and medicine dispensation.' },
  { name: 'Rural Health Camp – Checkup 1',              type: 'image', url: '/user-side/images/health/health1.jpeg', album: 'Rural Health Outreach', date: '2026-07-10', location: 'Poonamallee Health Center', albumDesc: 'Rural healthcare outreach and medicine dispensation.' },
  { name: 'Rural Health Camp – Checkup 2',              type: 'image', url: '/user-side/images/health/health2.jpeg', album: 'Rural Health Outreach', date: '2026-07-10', location: 'Poonamallee Health Center', albumDesc: 'Rural healthcare outreach and medicine dispensation.' },
  { name: 'Rural Health Camp – Checkup 3',              type: 'image', url: '/user-side/images/health/health3.jpeg', album: 'Rural Health Outreach', date: '2026-07-10', location: 'Poonamallee Health Center', albumDesc: 'Rural healthcare outreach and medicine dispensation.' },
  { name: 'Rural Health Camp – Checkup 4',              type: 'image', url: '/user-side/images/health/health4.jpeg', album: 'Rural Health Outreach', date: '2026-07-10', location: 'Poonamallee Health Center', albumDesc: 'Rural healthcare outreach and medicine dispensation.' },
  { name: 'Rural Health Camp – Medicine Distribution',  type: 'image', url: '/user-side/images/health/health5.jpeg', album: 'Rural Health Outreach', date: '2026-07-10', location: 'Poonamallee Health Center', albumDesc: 'Rural healthcare outreach and medicine dispensation.' },

  // ── Foundation Events ────────────────────────────────────────────────
  { name: 'Eye Examination Camp - Ambattur',    type: 'image', url: '/user-side/images/event01.jpeg', album: 'Foundation Events', date: '2026-10-18', location: 'Ambattur, Chennai', albumDesc: 'Key foundation events and activities.' },
  { name: 'Women Welfare & Community Support',  type: 'image', url: '/user-side/images/event2.jpeg',  album: 'Foundation Events', date: '2026-06-20', location: 'Chennai Suburban', albumDesc: 'Key foundation events and activities.' },
  { name: 'Student Notebook & Kit Handover',    type: 'image', url: '/user-side/images/event3.jpeg',  album: 'Foundation Events', date: '2026-08-15', location: 'Thiruvallur District Govt School', albumDesc: 'Key foundation events and activities.' },
  { name: 'Health Camp Doctor Consultation',    type: 'image', url: '/user-side/images/event4.jpeg',  album: 'Foundation Events', date: '2026-07-10', location: 'Poonamallee Health Center', albumDesc: 'Key foundation events and activities.' },

  // ── Road & Social Welfare ────────────────────────────────────────────
  { name: 'Road Safety & Social Welfare – 1', type: 'image', url: '/user-side/images/road/road1.jpeg',    album: 'Road & Social Welfare', date: '2026-05-12', location: 'Chennai City Roads', albumDesc: 'Road safety awareness and social welfare activities.' },
  { name: 'Road Safety & Social Welfare – 2', type: 'image', url: '/user-side/images/road/road2.jpeg',    album: 'Road & Social Welfare', date: '2026-05-12', location: 'Chennai City Roads', albumDesc: 'Road safety awareness and social welfare activities.' },
  { name: 'Road Safety & Social Welfare – 4', type: 'image', url: '/user-side/images/road/road4.jpeg',    album: 'Road & Social Welfare', date: '2026-05-12', location: 'Chennai City Roads', albumDesc: 'Road safety awareness and social welfare activities.' },
  { name: 'Road Safety & Social Welfare – 5', type: 'image', url: '/user-side/images/road/road5.jpeg',    album: 'Road & Social Welfare', date: '2026-05-12', location: 'Chennai City Roads', albumDesc: 'Road safety awareness and social welfare activities.' },
  { name: 'News Article Coverage – 1',        type: 'image', url: '/user-side/images/road/Article1.jpeg', album: 'Road & Social Welfare', date: '2026-05-12', location: 'Chennai', albumDesc: 'Media coverage of foundation activities.' },
  { name: 'News Article Coverage – 2',        type: 'image', url: '/user-side/images/road/Article2.jpeg', album: 'Road & Social Welfare', date: '2026-05-12', location: 'Chennai', albumDesc: 'Media coverage of foundation activities.' },
  { name: 'News Article Coverage – 3',        type: 'image', url: '/user-side/images/road/Article3.jpeg', album: 'Road & Social Welfare', date: '2026-05-12', location: 'Chennai', albumDesc: 'Media coverage of foundation activities.' },
  { name: 'Road Outreach Video',              type: 'video', url: '/user-side/images/road/road3.mp4',    album: 'Road & Social Welfare', date: '2026-05-12', location: 'Chennai City Roads', albumDesc: 'Video documentation of road safety events.' },
  { name: 'News Coverage Video',              type: 'video', url: '/user-side/images/road/Article4.mp4', album: 'Road & Social Welfare', date: '2026-05-12', location: 'Chennai', albumDesc: 'Video documentation of media coverage.' },

  // ── Foundation Anniversary ───────────────────────────────────────────
  { name: 'Foundation Event Snapshot – 1', type: 'image', url: '/user-side/images/WhatsApp Image 2026-09-26 at 9.45.21 AM (1).jpeg', album: 'Foundation Anniversary', date: '2026-09-26', location: 'Foundation HQ', albumDesc: 'Annual day and foundation anniversary highlights.' },
  { name: 'Foundation Event Snapshot – 2', type: 'image', url: '/user-side/images/WhatsApp Image 2026-09-26 at 9.45.21 AM.jpeg',    album: 'Foundation Anniversary', date: '2026-09-26', location: 'Foundation HQ', albumDesc: 'Annual day and foundation anniversary highlights.' },
  { name: 'Foundation Event Snapshot – 3', type: 'image', url: '/user-side/images/WhatsApp Image 2026-09-26 at 9.45.22 AM (1).jpeg', album: 'Foundation Anniversary', date: '2026-09-26', location: 'Foundation HQ', albumDesc: 'Annual day and foundation anniversary highlights.' },
  { name: 'Foundation Event Snapshot – 4', type: 'image', url: '/user-side/images/WhatsApp Image 2026-09-26 at 9.45.22 AM.jpeg',    album: 'Foundation Anniversary', date: '2026-09-26', location: 'Foundation HQ', albumDesc: 'Annual day and foundation anniversary highlights.' },
  { name: 'Foundation Event Snapshot – 5', type: 'image', url: '/user-side/images/WhatsApp Image 2026-09-26 at 9.45.23 AM (1).jpeg', album: 'Foundation Anniversary', date: '2026-09-26', location: 'Foundation HQ', albumDesc: 'Annual day and foundation anniversary highlights.' },
  { name: 'Foundation Event Snapshot – 6', type: 'image', url: '/user-side/images/WhatsApp Image 2026-09-26 at 9.45.23 AM.jpeg',    album: 'Foundation Anniversary', date: '2026-09-26', location: 'Foundation HQ', albumDesc: 'Annual day and foundation anniversary highlights.' },
  { name: 'Foundation Annual Day Highlights', type: 'video', url: '/user-side/images/VID-20260926-WA0444.mp4', album: 'Foundation Anniversary', date: '2026-09-26', location: 'Foundation HQ', albumDesc: 'Annual day celebration video documentation.' }
];

function readBackup() {
  try {
    if (fs.existsSync(BACKUP_FILE)) {
      const data = fs.readFileSync(BACKUP_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading gallery backup:', err);
  }
  return SEED_ITEMS.map((item, idx) => ({ ...item, _id: 'seed-' + (idx + 1) }));
}

function writeBackup(items) {
  try {
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(items, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing gallery backup:', err);
  }
}

// GET all gallery items
exports.getGalleryItems = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let items = await Gallery.find().sort({ createdAt: -1 });
      if (items.length === 0) {
        // Seed database with foundation items
        await Gallery.insertMany(SEED_ITEMS);
        items = await Gallery.find().sort({ createdAt: -1 });
      }
      return res.status(200).json({ success: true, data: items, count: items.length });
    } else {
      const items = readBackup();
      return res.status(200).json({ success: true, data: items, count: items.length });
    }
  } catch (err) {
    console.error('Error fetching gallery items:', err);
    const items = readBackup();
    return res.status(200).json({ success: true, data: items, count: items.length });
  }
};

// POST upload/create gallery item
exports.createGalleryItem = async (req, res) => {
  try {
    const { name, type, url, album, date, location, albumDesc } = req.body;
    if (!name || !url) {
      return res.status(400).json({ success: false, message: 'Name and URL are required' });
    }

    const payload = {
      name,
      type: type || 'image',
      url,
      album: album || 'General',
      date: date || new Date().toISOString().split('T')[0],
      location: location || '',
      albumDesc: albumDesc || ''
    };

    if (mongoose.connection.readyState === 1) {
      const newItem = await Gallery.create(payload);
      return res.status(201).json({ success: true, data: newItem });
    } else {
      const items = readBackup();
      const newItem = { ...payload, _id: 'gal-' + Date.now() };
      items.unshift(newItem);
      writeBackup(items);
      return res.status(201).json({ success: true, data: newItem });
    }
  } catch (err) {
    console.error('Error creating gallery item:', err);
    return res.status(500).json({ success: false, message: 'Server error creating gallery item' });
  }
};

// PUT group multiple items into album
exports.groupGalleryItems = async (req, res) => {
  try {
    const { ids, album, date, location, albumDesc } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0 || !album) {
      return res.status(400).json({ success: false, message: 'Item IDs and album name are required' });
    }

    const updateFields = { album };
    if (date) updateFields.date = date;
    if (location) updateFields.location = location;
    if (albumDesc) updateFields.albumDesc = albumDesc;

    if (mongoose.connection.readyState === 1) {
      await Gallery.updateMany({ _id: { $in: ids } }, { $set: updateFields });
      const updated = await Gallery.find({ album }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, message: 'Album grouped successfully in database', data: updated });
    } else {
      const items = readBackup();
      items.forEach(item => {
        if (ids.includes(String(item._id))) {
          Object.assign(item, updateFields);
        }
      });
      writeBackup(items);
      return res.status(200).json({ success: true, message: 'Album grouped successfully', data: items });
    }
  } catch (err) {
    console.error('Error grouping gallery items:', err);
    return res.status(500).json({ success: false, message: 'Server error grouping album' });
  }
};

// DELETE single item
exports.deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      await Gallery.findByIdAndDelete(id);
    }
    const items = readBackup().filter(i => String(i._id) !== String(id));
    writeBackup(items);
    return res.status(200).json({ success: true, message: 'Media item deleted from database' });
  } catch (err) {
    console.error('Error deleting gallery item:', err);
    return res.status(500).json({ success: false, message: 'Server error deleting gallery item' });
  }
};

// POST bulk delete items
exports.bulkDeleteGalleryItems = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'No IDs provided' });
    }

    if (mongoose.connection.readyState === 1) {
      await Gallery.deleteMany({ _id: { $in: ids } });
    }
    const items = readBackup().filter(i => !ids.includes(String(i._id)));
    writeBackup(items);
    return res.status(200).json({ success: true, message: `Deleted ${ids.length} media items` });
  } catch (err) {
    console.error('Error bulk deleting gallery items:', err);
    return res.status(500).json({ success: false, message: 'Server error deleting gallery items' });
  }
};
