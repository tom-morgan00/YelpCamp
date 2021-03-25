const joi = require('joi');
const ExpressError = require('./ExpressError');

const campgroundSchema = joi.object({
  campground: joi
    .object({
      name: joi.string().required(),
      location: joi.string().required(),
      // image: joi.string().required(),
      price: joi.number().min(0).required(),
      description: joi.string().required(),
    })
    .required(),
});

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    console.log(error);
    const message = error.details.map((err) => err.message).join(' ');
    throw new ExpressError(400, message);
  }
  next();
};

const reviewSchema = joi.object({
  review: joi
    .object({
      rating: joi.number().min(1).max(5).required(),
      body: joi.string().required(),
    })
    .required(),
});

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    console.log(error);
    const message = error.details.map((err) => err.message).join(' ');
    throw new ExpressError(400, message);
  }
  next();
};

module.exports = { validateCampground, validateReview };
