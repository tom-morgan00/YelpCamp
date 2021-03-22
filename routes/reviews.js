const express = require('express');
const router = express.Router({ mergeParams: true });
const reviews = require('../controllers/reviews');
const catchAsync = require('../utils/catchAsync');
const { validateReview } = require('../utils/validateCampground');
const { isLoggedIn, isReviewAuthor } = require('../utils/middleware');

router.route('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete(
  '/:reviewID',
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
