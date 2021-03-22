const express = require('express');
const router = express.Router({ mergeParams: true });
const reviews = require('../controllers/reviews');
const catchAsync = require('../utils/catchAsync');
const { validateReview } = require('../utils/validateCampground');
const { isLoggedIn, isReviewAuthor } = require('../utils/middleware');

router
  .route('/')
  .post(isLoggedIn, validateReview, catchAsync(reviews.createReview));

router
  .route('/:reviewID')
  .delete(isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
