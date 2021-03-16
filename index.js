const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const ejsMate = require('ejs-mate');
const cookieParser = require('cookie-parser');
const campRoutes = require('./routes/campgrounds');
const adminRoutes = require('./routes/admin');

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
app.use(methodOverride('_method'));
app.use(cookieParser());

//Campground Routes
app.use('/campgrounds', campRoutes);
app.use('/admin', adminRoutes);

//Home Route
app.get('/', (req, res) => {
  res.render('home');
});

// Cookies
app.get('/greet', (req, res) => {
  const { name = 'No name' } = req.cookies;

  res.clearCookie('name');

  res.send(`Hello there, ${name}`);
});

app.get('/setname', (req, res) => {
  res.cookie('name', 'Nob');
  res.send('COOKIE SENT');
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
