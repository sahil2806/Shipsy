const mongoose = require('mongoose');
const User = require('./models/User');
const Ship = require('./models/Ship');
require('dotenv').config();

const sampleUsers = [
  {
    username: 'admin',
    email: 'admin@shipsy.com',
    password: 'admin123',
    role: 'admin',
    profile: {
      firstName: 'Admin',
      lastName: 'User'
    }
  },
  {
    username: 'manager',
    email: 'manager@shipsy.com',
    password: 'manager123',
    role: 'manager',
    profile: {
      firstName: 'Fleet',
      lastName: 'Manager'
    }
  },
  {
    username: 'operator',
    email: 'operator@shipsy.com',
    password: 'operator123',
    role: 'user',
    profile: {
      firstName: 'Ship',
      lastName: 'Operator'
    }
  }
];

const sampleShips = [
  {
    name: 'Ocean Voyager',
    type: 'Container Ship',
    capacity: '5000 TEU',
    status: 'Active',
    specifications: {
      length: 300,
      width: 40,
      height: 25,
      draft: 15,
      yearBuilt: 2018,
      flag: 'Panama',
      homePort: 'Rotterdam'
    },
    crew: {
      captain: 'Capt. John Smith',
      totalCrew: 25,
      requiredCrew: 20
    },
    location: {
      currentPort: 'Pacific Ocean',
      nextPort: 'Port of Los Angeles',
      estimatedArrival: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    maintenance: {
      lastMaintenance: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      nextMaintenance: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    }
  },
  {
    name: 'Sea Explorer',
    type: 'Bulk Carrier',
    capacity: '80000 DWT',
    status: 'Maintenance',
    specifications: {
      length: 280,
      width: 45,
      height: 22,
      draft: 18,
      yearBuilt: 2019,
      flag: 'Liberia',
      homePort: 'Singapore'
    },
    crew: {
      captain: 'Capt. Maria Garcia',
      totalCrew: 18,
      requiredCrew: 15
    },
    location: {
      currentPort: 'Port of Singapore',
      nextPort: 'Port of Shanghai',
      estimatedArrival: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    },
    maintenance: {
      lastMaintenance: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      nextMaintenance: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    }
  },
  {
    name: 'Maritime Star',
    type: 'Tanker',
    capacity: '120000 DWT',
    status: 'Docked',
    specifications: {
      length: 320,
      width: 50,
      height: 28,
      draft: 20,
      yearBuilt: 2017,
      flag: 'Marshall Islands',
      homePort: 'Rotterdam'
    },
    crew: {
      captain: 'Capt. David Wilson',
      totalCrew: 22,
      requiredCrew: 18
    },
    location: {
      currentPort: 'Port of Rotterdam',
      nextPort: 'Port of Hamburg',
      estimatedArrival: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    },
    maintenance: {
      lastMaintenance: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  },
  {
    name: 'Pacific Pioneer',
    type: 'Container Ship',
    capacity: '6000 TEU',
    status: 'Active',
    specifications: {
      length: 310,
      width: 42,
      height: 26,
      draft: 16,
      yearBuilt: 2020,
      flag: 'Panama',
      homePort: 'Los Angeles'
    },
    crew: {
      captain: 'Capt. Sarah Johnson',
      totalCrew: 28,
      requiredCrew: 22
    },
    location: {
      currentPort: 'Atlantic Ocean',
      nextPort: 'Port of New York',
      estimatedArrival: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    },
    maintenance: {
      lastMaintenance: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      nextMaintenance: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000)
    }
  },
  {
    name: 'Atlantic Voyager',
    type: 'Passenger Ship',
    capacity: '2000 Passengers',
    status: 'Active',
    specifications: {
      length: 250,
      width: 35,
      height: 30,
      draft: 12,
      yearBuilt: 2021,
      flag: 'Bahamas',
      homePort: 'Miami'
    },
    crew: {
      captain: 'Capt. Michael Brown',
      totalCrew: 35,
      requiredCrew: 30
    },
    location: {
      currentPort: 'Caribbean Sea',
      nextPort: 'Port of Miami',
      estimatedArrival: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    },
    maintenance: {
      lastMaintenance: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      nextMaintenance: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000)
    }
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shipsy');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Ship.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`👤 Created user: ${user.username}`);
    }

    // Create ships
    for (const shipData of sampleShips) {
      const ship = new Ship(shipData);
      await ship.save();
      console.log(`🚢 Created ship: ${ship.name}`);
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log(`📊 Created ${createdUsers.length} users and ${sampleShips.length} ships`);
    
    // Display sample login credentials
    console.log('\n🔑 Sample Login Credentials:');
    console.log('Admin: admin@shipsy.com / admin123');
    console.log('Manager: manager@shipsy.com / manager123');
    console.log('Operator: operator@shipsy.com / operator123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seed function
seedDatabase(); 