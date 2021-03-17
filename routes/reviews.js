const express = require('express');
const router = express.Router({ mergeParams: true });
const Camp = require('../models/Camp');
const Review = require('../models/Review');
const catchAsync = require('../utils/catchAsync');
const { validateReview } = require('../utils/validateCampground');

router.post(
  '/',
  validateReview,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Camp.findById(id);
    const review = await new Review({
      ...req.body.review,
    });
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  '/:reviewID',
  catchAsync(async (req, res) => {
    const { id, reviewID } = req.params;
    await Review.findByIdAndDelete(reviewID);
    await Camp.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
