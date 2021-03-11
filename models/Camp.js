const mongoose = require('mongoose');

const CampSchema = new mongoose.Schema({
  name: String,
  price: String,
  description: String,
  location: String,
});

module.exports = mongoose.model('Campground', CampSchema);
