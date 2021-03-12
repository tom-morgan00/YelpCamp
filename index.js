const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Camp = require('./models/Camp');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const ejsMate = require('ejs-mate');
const validateCampground = require('./utils/validateCampground');

//MongoDB connection
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useFindAndModify: true
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

//Routes - CRUD
app.get('/', (req, res) => {
  res.render('home');
});

// app.get('/admin', (req, res) => {
//   if (req.query.password === 'thomas') {
//     res.send('Welcome Thomas');
//   }
// });

//Get all Campgrounds
app.get(
  '/campgrounds',
  catchAsync(async (req, res) => {
    const campgrounds = await Camp.find({});
    res.render('campgrounds/index', { campgrounds });
  })
);

//Create new Campground - Form
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

//Create new Campground - Submit
app.post(
  '/campgrounds',
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
app.get(
  '/campgrounds/:id',
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Camp.findById(id);
    res.render('campgrounds/show', { campground });
  })
);

//Edit Campground - Form
app.get(
  '/campgrounds/:id/edit',
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Camp.findById(id);
    res.render('campgrounds/edit', { campground });
  })
);

//Edit Campground - Submit
app.put(
  '/campgrounds/:id',
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
app.delete(
  '/campgrounds/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Camp.findByIdAndDelete(id);
    res.redirect('/campgrounds');
  })
);

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
