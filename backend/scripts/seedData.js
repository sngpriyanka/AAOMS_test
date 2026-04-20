#!/usr/bin/env node

/**
 * Sample Data Initialization Script
 * Run: node scripts/seedData.js
 * 
 * This script populates the database with sample data for testing
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log('✓ Created data directory');
}

// Sample Users
const users = [
  {
    id: uuidv4(),
    email: 'customer@example.com',
    password: bcrypt.hashSync('customer123', 10),
    name: 'John Doe',
    role: 'customer',
    phone: '9876543210',
    address: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipcode: '400001',
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    email: 'admin@example.com',
    password: bcrypt.hashSync('admin123', 10),
    name: 'Admin User',
    role: 'admin',
    phone: '9876543211',
    address: '456 Admin Ave',
    city: 'Delhi',
    state: 'Delhi',
    zipcode: '110001',
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    email: 'super@example.com',
    password: bcrypt.hashSync('super123', 10),
    name: 'Super Admin',
    role: 'super_admin',
    phone: '9876543212',
    address: '789 Super Lane',
    city: 'Bangalore',
    state: 'Karnataka',
    zipcode: '560001',
    createdAt: new Date().toISOString()
  }
];

// Sample Products
const products = [
  {
    id: uuidv4(),
    slug: 'burnt-sienna-active-mesh-tshirt',
    name: 'Burnt Sienna: Active Mesh T-Shirt',
    price: 1275,
    sku: 'BTOSTHO5',
    category: 't-shirts',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600'
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: [{ name: 'Burnt Sienna', code: '#c75b39' }],
    description: { tagline: 'TRAIN HARDER. MOVE FASTER. STAY COOLER.' },
    productInfo: [
      { label: 'Material', value: '100% Polyester Mesh' },
      { label: 'Fit', value: 'Regular Fit' },
      { label: 'Care', value: 'Machine wash cold' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    slug: 'premium-medical-apron',
    name: 'Premium Medical Apron',
    price: 899,
    sku: 'BTAPRON01',
    category: 'apron',
    images: ['https://images.unsplash.com/photo-1576091160550-112173f7f7b0?w=600'],
    sizes: ['One Size'],
    colors: [{ name: 'White', code: '#FFFFFF' }],
    description: { tagline: 'PROFESSIONAL MEDICAL GRADE APRON' },
    productInfo: [
      { label: 'Material', value: 'Cotton Blend' },
      { label: 'Pockets', value: '3 Deep Pockets' },
      { label: 'Care', value: 'Machine Washable' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    slug: 'hospital-medical-scrub',
    name: 'Hospital Medical Scrub Set',
    price: 1499,
    sku: 'BTSCRUB01',
    category: 'scrub',
    images: ['https://images.unsplash.com/photo-1587280413947-bb5d6e9aba48?w=600'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Medical Green', code: '#2d5a3d' },
      { name: 'Medical Blue', code: '#1b3a6b' }
    ],
    description: { tagline: 'COMFORT MEETS PERFORMANCE' },
    productInfo: [
      { label: 'Material', value: 'Premium Cotton' },
      { label: 'Fit', value: 'Regular Fit' },
      { label: 'Pockets', value: '6 Pockets' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    slug: 'trooper-cargo-pants',
    name: 'TrooperGo: 2-in-1 Utility Cargo Pants',
    price: 4250,
    sku: 'BTCARGO01',
    category: 'pants',
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600'],
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'Olive', code: '#2d4a3e' },
      { name: 'Navy', code: '#1a2a4a' },
      { name: 'Rust', code: '#c75b39' }
    ],
    description: { tagline: 'UTILITY MEETS STYLE' },
    productInfo: [
      { label: 'Material', value: 'Cotton-Nylon Blend' },
      { label: 'Pockets', value: '10+ Pockets' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    slug: 'sunday-race-club-cap',
    name: 'Sunday Race Club: Motorsport Baseball Cap',
    price: 899,
    sku: 'BTCAP01',
    category: 'accessories',
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600'],
    sizes: ['One Size'],
    colors: [{ name: 'Black', code: '#000000' }],
    description: { tagline: 'RACE DAY READY' },
    productInfo: [
      { label: 'Material', value: 'Cotton Twill' },
      { label: 'Size', value: 'Adjustable' }
    ],
    createdAt: new Date().toISOString()
  }
];

// Sample Orders
const customerId = users[0].id;
const orderItems = [
  {
    id: `${products[0].id}_${Date.now()}`,
    productId: products[0].id,
    quantity: 2,
    size: 'M',
    color: 'Burnt Sienna',
    price: 1275,
    customization: null
  },
  {
    id: `${products[1].id}_${Date.now() + 1}`,
    productId: products[1].id,
    quantity: 1,
    size: 'One Size',
    color: 'White',
    price: 899,
    customization: {
      type: 'embroidery_name',
      value: 'John Doe',
      price: 200
    }
  }
];

const orders = [
  {
    id: uuidv4(),
    userId: customerId,
    items: orderItems,
    shippingAddress: users[0].address + ', ' + users[0].city,
    paymentMethod: 'card',
    total: 1275 * 2 + 899 + 200,
    status: 'delivered',
    paymentStatus: 'completed',
    trackingNumber: `BT${Date.now()}001`,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    userId: customerId,
    items: [orderItems[0]],
    shippingAddress: users[0].address + ', ' + users[0].city,
    paymentMethod: 'card',
    total: 1275 * 2,
    status: 'processing',
    paymentStatus: 'completed',
    trackingNumber: `BT${Date.now()}002`,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    updatedAt: new Date().toISOString()
  }
];

// Sample Cart
const carts = [
  {
    id: uuidv4(),
    userId: customerId,
    items: [
      {
        id: `${products[2].id}_${Date.now()}`,
        productId: products[2].id,
        quantity: 1,
        size: 'M',
        color: 'Medical Green',
        price: 1499,
        customization: {
          type: 'embroidery_both',
          value: { name: 'John', logo: 'Company Logo' },
          price: 400
        },
        addedAt: new Date().toISOString()
      }
    ],
    total: 1499 + 400,
    createdAt: new Date().toISOString()
  }
];

// Function to save data
function saveData(filename, data) {
  const filepath = path.join(DATA_DIR, `${filename}.json`);
  const json = JSON.stringify(data, null, 2);
  
  try {
    fs.writeFileSync(filepath, json, 'utf-8');
    console.log(`✓ Created ${filename}.json (${data.length} items)`);
  } catch (error) {
    console.error(`✗ Error creating ${filename}.json:`, error.message);
  }
}

// Save all data
console.log('\n📝 Initializing sample data...\n');

saveData('users', users);
saveData('products', products);
saveData('orders', orders);
saveData('carts', carts);

console.log('\n✅ Sample data initialized successfully!\n');

console.log('📊 Default Credentials:');
console.log('   Customer: customer@example.com / customer123');
console.log('   Admin:    admin@example.com / admin123');
console.log('   Super:    super@example.com / super123\n');

console.log('🎯 Next steps:');
console.log('   1. npm run dev   (start server)');
console.log('   2. Test endpoints at http://localhost:5000/api\n');
