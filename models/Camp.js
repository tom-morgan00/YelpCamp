const mongoose = require('mongoose');

const CampSchema = new mongoose.Schema({
  name: String,
  image: String,
  price: Number,
  description: String,
  location: String,
});

module.exports = mongoose.model('Campground', CampSchema);
