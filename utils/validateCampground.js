const baseJoi = require('joi');
const ExpressError = require('./ExpressError');
const sanitizeHTML = require('sanitize-html');

const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.escapeHTML': '{{#label}} must not include HTML!',
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHTML(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error('string.escapeHTML', { value });
        return clean;
      },
    },
  },
});

const joi = baseJoi.extend(extension);

const campgroundSchema = joi.object({
  campground: joi
    .object({
      name: joi.string().required().escapeHTML(),
      location: joi.string().required().escapeHTML(),
      price: joi.number().min(0).required(),
      description: joi.string().required().escapeHTML(),
    })
    .required(),
  deleteImages: joi.array(),
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
      body: joi.string().required().escapeHTML(),
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
