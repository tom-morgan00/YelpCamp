const { options } = require('joi');
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

const geometrySchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const opts = {
  toJSON: {
    virtuals: true,
  },
};
const campSchema = new Schema(
  {
    name: String,
    images: [imageSchema],
    price: Number,
    description: String,
    geometry: geometrySchema,
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
  },
  opts
);

campSchema.virtual('properties').get(function () {
  return {
    id: this._id,
    name: this.name,
  };
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
