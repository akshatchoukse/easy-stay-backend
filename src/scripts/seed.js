const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Hotel = require('../models/Hotel');
const connectDB = require('../config/db');

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@hotels.com',
    password: 'admin123',
    role: 'Admin',
  },
  {
    name: 'Manager User',
    email: 'manager@hotels.com',
    password: 'manager123',
    role: 'Manager',
  },
  {
    name: 'Receptionist User',
    email: 'reception@hotels.com',
    password: 'reception123',
    role: 'Receptionist',
  },
  {
    name: 'Housekeeping User',
    email: 'housekeeping@hotels.com',
    password: 'house123',
    role: 'Housekeeping',
  },
];

const hotelsRaw = [
  {
    name: 'The Grand Palazzo',
    location: 'Jaipur, Rajasthan',
    description: 'Experience unmatched luxury at The Grand Palazzo, where every detail is crafted for...',
    images: [{ url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&y=400', public_id: 'sample1' }],
    amenities: ['Spa', 'Pool', 'Fine Dining'],
  },
  {
    name: 'Seaside Retreat',
    location: 'Goa, Goa',
    description: 'A boutique paradise on Goas pristine coastline. Seaside Retreat blends modern...',
    images: [{ url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&y=400', public_id: 'sample2' }],
    amenities: ['Beach Access', 'Surf School', 'Tropical Bar'],
  },
  {
    name: 'Heritage Grand',
    location: 'Udaipur, Rajasthan',
    description: 'Step into a world of regal elegance at Heritage Grand. This meticulously restored...',
    images: [{ url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&y=400', public_id: 'sample3' }],
    amenities: ['Palace View', 'Heritage Tour', 'Royal Suite'],
  },
];

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Hotel.deleteMany();

    // Add new users
    const createdUsers = await User.create(users);
    const adminUser = createdUsers.find(u => u.role === 'Admin');

    // Add hotels
    const hotels = hotelsRaw.map(h => ({ ...h, createdBy: adminUser._id }));
    await Hotel.create(hotels);

    console.log('Data (Users & Hotels) Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();
