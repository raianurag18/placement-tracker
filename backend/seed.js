const mongoose = require('mongoose');
const Placement = require('./models/Placement');
const placements = require('./data/placements.json');
require('dotenv').config({ path: './backend/.env' });

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Placement.deleteMany({});
    await Placement.insertMany(placements);

    console.log('Database seeded successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
};

seedDB();
