#!/usr/bin/env node
/**
 * Seed Demo Accounts Script
 * 
 * This script creates demo accounts for testing:
 * - Customer: customer@example.com / customer123
 * - Admin: admin@example.com / admin123
 * - Super Admin: super@example.com / super123
 * 
 * Usage:
 *   node scripts/seedDemoAccounts.js
 */

const bcrypt = require('bcryptjs');
const Database = require('../models/Database');
const { validateEmail, validatePassword } = require('../utils/validators');

const USERS_COLLECTION = 'users';

async function seedDemoAccounts() {
  console.log('\n🌱 Seeding Demo Accounts...\n');

  const demoAccounts = [
    {
      email: 'customer@example.com',
      password: 'customer123',
      name: 'John Doe',
      role: 'customer'
    },
    {
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin'
    },
    {
      email: 'super@example.com',
      password: 'super123',
      name: 'Super Admin',
      role: 'super_admin'
    }
  ];

  for (const account of demoAccounts) {
    try {
      // Check if account already exists
      const existing = Database.findBy(USERS_COLLECTION, 'email', account.email);
      if (existing) {
        console.log(`⏭️  Skipped ${account.email} (already exists)`);
        continue;
      }

      // Validate
      if (!validateEmail(account.email)) {
        throw new Error(`Invalid email: ${account.email}`);
      }
      if (!validatePassword(account.password)) {
        throw new Error(`Password too short: ${account.email}`);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(account.password, 10);

      // Create user
      const user = Database.create(USERS_COLLECTION, {
        email: account.email,
        password: hashedPassword,
        name: account.name,
        role: account.role,
        phone: '9876543210',
        address: '123 Demo Street',
        city: 'Demo City',
        state: 'DS',
        zipcode: '12345',
        createdAt: new Date().toISOString()
      });

      console.log(`✅ Created ${account.role.toUpperCase()}: ${account.email}`);
      console.log(`   📧 Email: ${account.email}`);
      console.log(`   🔐 Password: ${account.password}`);
      console.log(`   👤 Name: ${account.name}\n`);
    } catch (error) {
      console.error(`❌ Failed to create ${account.email}: ${error.message}\n`);
    }
  }

  console.log('\n✅ Demo account seeding complete!\n');
  console.log('🧪 Test Accounts:\n');
  console.log('  Customer:  customer@example.com / customer123');
  console.log('  Admin:     admin@example.com / admin123');
  console.log('  Super:     super@example.com / super123\n');
}

seedDemoAccounts().catch(error => {
  console.error('❌ Seeding error:', error);
  process.exit(1);
});
