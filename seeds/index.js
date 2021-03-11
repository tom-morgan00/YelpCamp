const mongoose = require('mongoose');
const cities = require('./cities');
const Campground = require('../models/Camp');
const { places, descriptors } = require('./helpers');

//mongo config
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to YelpCamp'));

//creating sample data
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i <= 50; i++) {
    const randomNum = Math.floor(Math.random() * cities.length);
    const camp = new Campground({
      location: `${cities[randomNum].city}`,
      name: `${sample(descriptors)} ${sample(places)}`,
    });
    await camp.save();
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
