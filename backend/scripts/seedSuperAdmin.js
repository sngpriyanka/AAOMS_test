// Script to create a Super Admin account
// Usage: node scripts/seedSuperAdmin.js

const bcrypt = require('bcryptjs');
const Database = require('../models/Database');
const { v4: uuidv4 } = require('uuid');

const USERS_COLLECTION = 'users';

async function createSuperAdmin() {
  try {
    console.log('🔐 Creating Super Admin Account...\n');

    // Super Admin Credentials (Change these!)
    const superAdminEmail = 'cngrupa123@gmail.com';
    const superAdminPassword = 'rupa123'; // Change this to secure password
    const superAdminName = 'Super Administrator';

    // Check if super admin already exists
    const existingAdmin = Database.findBy(USERS_COLLECTION, 'email', superAdminEmail);
    if (existingAdmin) {
      console.log('❌ Super Admin account already exists!');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(superAdminPassword, 10);

    // Create super admin
    const superAdmin = Database.create(USERS_COLLECTION, {
      id: uuidv4(),
      email: superAdminEmail,
      password: hashedPassword,
      name: superAdminName,
      role: 'super_admin',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipcode: '',
      isActive: true,
      createdAt: new Date().toISOString()
    });

    console.log('✅ Super Admin Account Created Successfully!\n');
    console.log('📋 Account Details:');
    console.log('─'.repeat(50));
    console.log(`   Name:  ${superAdmin.name}`);
    console.log(`   Email: ${superAdmin.email}`);
    console.log(`   Role:  ${superAdmin.role}`);
    console.log(`   ID:    ${superAdmin.id}`);
    console.log('─'.repeat(50));
    console.log('\n🔐 Login Credentials:');
    console.log('─'.repeat(50));
    console.log(`   Email:    ${superAdminEmail}`);
    console.log(`   Password: ${superAdminPassword}`);
    console.log('─'.repeat(50));
    console.log('\n⚠️  IMPORTANT SECURITY NOTES:');
    console.log('─'.repeat(50));
    console.log('1. Change the default password immediately after first login');
    console.log('2. Never share this password');
    console.log('3. Store this in a secure password manager');
    console.log('4. Only share the email address with trusted personnel');
    console.log('5. Enable 2FA if available');
    console.log('─'.repeat(50));
    console.log('\n✅ Setup Complete!');

  } catch (error) {
    console.log('❌ Error creating super admin:', error.message);
    process.exit(1);
  }
}

// Run the script
createSuperAdmin();
