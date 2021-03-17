const express = require('express');
const router = express.Router();
const Camp = require('../models/Camp');
const catchAsync = require('../utils/catchAsync');
const { validateCampground } = require('../utils/validateCampground');

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
    const campground = new Camp({
      ...req.body.campground,
    });
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//Get one Campground
router.get(
  '/:id',
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Camp.findById(id).populate('reviews');

    if (!campground) {
      req.flash('error', 'That campground does not exist!');
      return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {
      campground,
      messages: req.flash('success'),
    });
  })
);

//Edit Campground - Form
router.get(
  '/:id/edit',
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Camp.findById(id);
    if (!campground) {
      req.flash('error', 'That campground does not exist!');
      return res.redirect('/campgrounds');
    }
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
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//Delete Campground
router.delete(
  '/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Camp.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
  })
);

module.exports = router;
