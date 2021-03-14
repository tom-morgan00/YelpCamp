const mongoose = require('mongoose');
const { Schema } = mongoose;

const campSchema = new Schema({
  name: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
});

module.exports = mongoose.model('Campground', campSchema);
