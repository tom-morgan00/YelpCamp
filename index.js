if (process.env.NODE_ENV !== 'production') {
  require('dotenv/config');
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const ejsMate = require('ejs-mate');
const cookieParser = require('cookie-parser');
const campRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/User');

//MongoDB connection
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console.log('connection error')));
db.once('open', () => console.log('database connected'));
//App setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(cookieParser('signed_cookie'));

//Session and Flash
const sessionConfig = {
  saveUninitialized: true,
  secret: 'this_is_a_secret',
  resave: false,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  // console.log(req.session);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.get('/fakeUser', async (req, res) => {
  const user = new User({
    email: 'tom@gmail.com',
    username: 'tom',
  });
  const newUser = await User.register(user, 'tom123');

  res.send(newUser);
});

//Campground Routes
app.use('/', userRoutes);
app.use('/campgrounds', campRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
// app.use('/admin', adminRoutes);

//Home Route
app.get('/', (req, res) => {
  res.render('home');
});

//Error handling
//404 Error Not Found
app.all('*', (req, res, next) => {
  next(new ExpressError(404, 'Page Not Found!'));
});

//Middleware for handling all errors
app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) {
    err.message = 'Something went wrong';
  }
  res.status(status).render('error', { err });
});

//Server listening
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
