const ExpressError = require('./ExpressError');

const catchAsync = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => next(new ExpressError(404, err.message)));
  };
};

module.exports = catchAsync;
