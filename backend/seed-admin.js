/**
 * Seed Script: Creates the initial admin user in MongoDB Atlas
 * Run once: node backend/seed-admin.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const MONGODB_URI = process.env.MONGODB_URI;

const seedAdmin = async () => {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not set in backend/.env');
    process.exit(1);
  }

  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB Atlas');

    // Check if admin already exists
    const existing = await Admin.findOne({ email: 'admin@jskfoundation.org' });
    if (existing) {
      console.log('ℹ️  Admin already exists with email: admin@jskfoundation.org');
      console.log('   Use these credentials to log in:');
      console.log('   Email   : admin@jskfoundation.org');
      console.log('   Password: JSK@Admin2026!');
    } else {
      // Create dummy admin
      await Admin.create({
        name: 'JSK Foundation Admin',
        email: 'admin@jskfoundation.org',
        password: 'JSK@Admin2026!', // will be hashed by the model's pre-save hook
        role: 'super_admin',
        isActive: true,
      });

      console.log('\n✅ Admin user created successfully!');
      console.log('─────────────────────────────────────');
      console.log('   Name    : JSK Foundation Admin');
      console.log('   Email   : admin@jskfoundation.org');
      console.log('   Password: JSK@Admin2026!');
      console.log('   Role    : super_admin');
      console.log('─────────────────────────────────────');
      console.log('🔐 PLEASE CHANGE THESE CREDENTIALS AFTER FIRST LOGIN.\n');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    if (err.message.includes('IP')) {
      console.log('💡 Go to MongoDB Atlas → Network Access → Add IP Address → Allow from anywhere (0.0.0.0/0)');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

seedAdmin();
