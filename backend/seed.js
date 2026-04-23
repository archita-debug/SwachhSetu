/**
 * Seed script – run once to populate demo data
 * Usage:  node backend/seed.js
 */
require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const User     = require('./models/User');
const Report   = require('./models/Report');

const USERS = [
  {
    name: 'Arjun Kumar',
    email: 'citizen@demo.com',
    password: 'demo1234',
    role: 'citizen',
    coins: 1240,
    points: 1240,
    badges: ['Early Adopter', 'First Report'],
    wasteData: { today: 2.5, thisWeek: 15.2, thisMonth: 58.1 },
    trainingProgress: 40,
    isCompliant: true,
  },
  {
    name: 'Municipal Authority',
    email: 'authority@demo.com',
    password: 'demo1234',
    role: 'authority',
    coins: 0,
    points: 0,
    badges: [],
    wasteData: { today: 0, thisWeek: 0, thisMonth: 0 },
    trainingProgress: 100,
    isCompliant: true,
  },
  { name: 'Rahul Sharma',  email: 'rahul@demo.com',  password: 'demo1234', role: 'citizen', coins: 3450, points: 3450, wasteData:{today:1.2,thisWeek:8,thisMonth:42}, trainingProgress:100 },
  { name: 'Priya Kapoor',  email: 'priya@demo.com',  password: 'demo1234', role: 'citizen', coins: 2890, points: 2890, wasteData:{today:2,thisWeek:12,thisMonth:50},  trainingProgress:90  },
  { name: 'Anjali Mehta',  email: 'anjali@demo.com', password: 'demo1234', role: 'citizen', coins: 2210, points: 2210, wasteData:{today:0.8,thisWeek:6,thisMonth:30}, trainingProgress:75  },
  { name: 'Sunita Devi',   email: 'sunita@demo.com', password: 'demo1234', role: 'citizen', coins: 1980, points: 1980, wasteData:{today:1.5,thisWeek:9,thisMonth:38}, trainingProgress:60  },
  { name: 'Karan Verma',   email: 'karan@demo.com',  password: 'demo1234', role: 'citizen', coins: 1100, points: 1100, wasteData:{today:0.5,thisWeek:4,thisMonth:18}, trainingProgress:50  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing
    await User.deleteMany({});
    await Report.deleteMany({});
    console.log('🗑  Cleared existing data');

    // Create users
    const created = await User.insertMany(
      await Promise.all(USERS.map(async u => {
        const bcrypt = require('bcryptjs');
        return { ...u, password: await bcrypt.hash(u.password, 10) };
      }))
    );
    console.log(`👤 Created ${created.length} users`);

    const citizen = created.find(u => u.email === 'citizen@demo.com');

    // Sample reports
    await Report.insertMany([
      {
        user: citizen._id,
        category: 'Illegal Dumping',
        description: 'Large pile of construction debris illegally dumped near Main St corner.',
        location: { lat: 25.5941, lng: 85.1376, address: 'Main St, Patna' },
        status: 'Under Review',
        coinsAwarded: 20,
      },
      {
        user: citizen._id,
        category: 'Overflowing Bin',
        description: 'Dustbin near Gandhi Park overflowing, needs immediate pickup.',
        location: { lat: 25.6100, lng: 85.1500, address: 'Gandhi Park, Patna' },
        status: 'Action Taken',
        coinsAwarded: 20,
      },
      {
        user: citizen._id,
        category: 'Construction Debris',
        description: 'Debris left behind after road work near New Market.',
        location: { lat: 25.6200, lng: 85.1600, address: 'New Market, Patna' },
        status: 'Resolved',
        coinsAwarded: 20,
      },
    ]);
    console.log('📋 Created 3 sample reports');

    console.log('\n🎉 Seed complete!\n');
    console.log('Demo logins:');
    console.log('  Citizen   → citizen@demo.com   / demo1234');
    console.log('  Authority → authority@demo.com / demo1234');
    console.log('  Leaderboard users seeded with realistic points\n');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
