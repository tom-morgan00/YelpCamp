const express = require('express');
const router = express.Router();
const Camp = require('../models/Camp');
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/Review');
const {
  validateCampground,
  validateReview,
} = require('../utils/validateCampground');

router.get(
  '/',
  catchAsync(async (req, res) => {
    const campgrounds = await Camp.find({});
    res.render('campgrounds/index', { campgrounds });
  })
);

//Create new Campground - Form
router.get('/new', (req, res) => {
  res.render('campgrounds/new');
});

//Create new Campground - Submit
router.post(
  '/',
  validateCampground,
  catchAsync(async (req, res, next) => {
    // if (!req.body.campground)
    //   throw new ExpressError(400, 'Invalid Campground Data');

    const campground = new Camp({
      ...req.body.campground,
    });
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//Get one Campground
router.get(
  '/:id',
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Camp.findById(id).populate('reviews');
    res.render('campgrounds/show', { campground });
  })
);

//Edit Campground - Form
router.get(
  '/:id/edit',
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Camp.findById(id);
    res.render('campgrounds/edit', { campground });
  })
);

//Edit Campground - Submit
router.put(
  '/:id',
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    if (!req.body.campground)
      throw new ExpressError(400, 'Invalid Campground Data');

    const campground = await Camp.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//Delete Campground
router.delete(
  '/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Camp.findByIdAndDelete(id);
    res.redirect('/campgrounds');
  })
);

router.post(
  '/:id/reviews',
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
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  '/:id/reviews/:reviewID',
  catchAsync(async (req, res) => {
    const { id, reviewID } = req.params;
    await Review.findByIdAndDelete(reviewID);
    await Camp.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
