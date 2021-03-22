const Camp = require('../models/Camp');

module.exports.index = async (req, res) => {
  const campgrounds = await Camp.find({});
  res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
  const campground = new Camp({
    ...req.body.campground,
  });
  campground.author = req.user._id;
  await campground.save();
  req.flash('success', 'Successfully made a new campground!');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res, next) => {
  const { id } = req.params;
  const campground = await await Camp.findById(id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    })
    .populate('author');
  // console.log(campground);

  if (!campground) {
    req.flash('error', 'That campground does not exist!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', {
    campground,
    messages: req.flash('success'),
  });
};

module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Camp.findById(id);

  if (!campground) {
    req.flash('error', 'That campground does not exist!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;

  if (!req.body.campground)
    throw new ExpressError(400, 'Invalid Campground Data');

  const campground = await Camp.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  req.flash('success', 'Successfully updated campground!');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;

  await Camp.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted campground!');
  res.redirect('/campgrounds');
};
