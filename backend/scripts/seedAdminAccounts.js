const Database = require('../models/Database');
const bcrypt = require('bcryptjs');

async function seedAdminAccounts() {
  try {
    // Admin account
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      phone: '9876543210',
      address: '123 Admin Street',
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString()
    };

    // Super Admin account
    const superAdminPassword = await bcrypt.hash('super123', 10);
    const superAdminUser = {
      name: 'Super Admin User',
      email: 'super@example.com',
      password: superAdminPassword,
      phone: '9999999999',
      address: '456 Super Admin Ave',
      role: 'super_admin',
      isActive: true,
      createdAt: new Date().toISOString()
    };

    // Check if accounts already exist
    const adminExists = Database.findBy('users', 'email', 'admin@example.com');
    const superAdminExists = Database.findBy('users', 'email', 'super@example.com');

    if (!adminExists) {
      Database.create('users', adminUser);
      console.log('✅ Admin account created: admin@example.com / admin123');
    } else {
      console.log('⚠️  Admin account already exists');
    }

    if (!superAdminExists) {
      Database.create('users', superAdminUser);
      console.log('✅ Super Admin account created: super@example.com / super123');
    } else {
      console.log('⚠️  Super Admin account already exists');
    }

    console.log('\n✅ Admin accounts seeded successfully!');
    console.log('\nDemo Credentials:');
    console.log('Admin: admin@example.com / admin123');
    console.log('Super Admin: super@example.com / super123');

  } catch (error) {
    console.error('❌ Error seeding admin accounts:', error);
    process.exit(1);
  }
}

// Run the seeding
seedAdminAccounts();
