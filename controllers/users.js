const User = require('../models/User');

module.exports.renderRegisterForm = (req, res) => {
  res.render('users/register');
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({
      username,
      email,
    });
    const newUser = await User.register(user, password);
    console.log(newUser);
    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', 'Welcome to YelpCamp!');
      res.redirect('/campgrounds');
    });
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/register');
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render('users/login');
};

module.exports.login = (req, res) => {
  req.flash('success', 'Welcome back');
  const redirectUrl = req.session.returnTo || '/campgrounds';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'Goodbye');
  res.redirect('/campgrounds');
};
