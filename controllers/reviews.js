const Camp = require('../models/Camp');
const Review = require('../models/Review');

module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const campground = await Camp.findById(id);
  const review = await new Review({
    ...req.body.review,
  });
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash('success', 'Successfully created new review!');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewID } = req.params;
  await Review.findByIdAndDelete(reviewID);
  await Camp.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
  req.flash('success', 'Successfully deleted review!');
  res.redirect(`/campgrounds/${id}`);
};
