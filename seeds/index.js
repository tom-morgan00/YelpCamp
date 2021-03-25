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
const randomPrice = () => Math.round(Math.random() * 100) + 25;
const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i <= 50; i++) {
    const randomNum = Math.floor(Math.random() * cities.length);
    const camp = new Campground({
      location: `${cities[randomNum].city}`,
      name: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url:
            'https://res.cloudinary.com/tom1903/image/upload/v1616651901/YelpCamp/umeiwymlpell7g7pug9c.jpg',
          filename: 'YelpCamp/umeiwymlpell7g7pug9c',
        },
        {
          url:
            'https://res.cloudinary.com/tom1903/image/upload/v1616651901/YelpCamp/alojxr97hcdugozsbljm.jpg',
          filename: 'YelpCamp/alojxr97hcdugozsbljm',
        },
      ],
      geometry: {
        coordinates: [-3, 51.58333],
        type: 'Point',
      },
      price: randomPrice() - 0.01,
      author: '60575d7cbd9ec161cc8e7d9a',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Id volutpat lacus laoreet non curabitur gravida arcu ac. Sed cras ornare arcu dui vivamus arcu felis. In pellentesque massa placerat duis ultricies lacus. Risus pretium quam vulputate dignissim suspendisse in est. Ipsum dolor sit amet consectetur adipiscing elit. Pellentesque id nibh tortor id aliquet lectus proin nibh nisl. Purus sit amet luctus venenatis lectus magna fringilla urna porttitor. Tempor orci eu lobortis elementum nibh. Gravida cum sociis natoque penatibus. Consequat semper viverra nam libero justo laoreet sit amet. Porttitor leo a diam sollicitudin tempor id eu nisl nunc. Sed viverra tellus in hac habitasse platea. Et odio pellentesque diam volutpat commodo sed egestas.',
    });
    await camp.save();
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
