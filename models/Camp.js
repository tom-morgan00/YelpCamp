const mongoose = require('mongoose');
const { Schema } = mongoose;
const Review = require('./Review');

//res.cloudinary.com/tom1903/image/upload/v1616655685/YelpCamp/vm43o5qum9hwrsjpfgbh.jpg

const imageSchema = new Schema({
  url: String,
  filename: String,
});
imageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});

const campSchema = new Schema({
  name: String,
  images: [imageSchema],
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
});

campSchema.post('findOneAndDelete', async (doc) => {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model('Campground', campSchema);
