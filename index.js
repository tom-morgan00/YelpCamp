const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Camp = require('./models/Camp');
const ejsMate = require('ejs-mate');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useFindAndModify: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console.log('connection error')));
db.once('open', () => console.log('database connected'));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Camp.find({});
  res.render('campgrounds/index', { campgrounds });
});

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

app.post('/campgrounds', async (req, res) => {
  const { name, location } = req.body.campground;
  console.log(name, location);
  const campground = new Camp({
    name,
    location,
  });
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

app.get('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  const campground = await Camp.findById(id);
  res.render('campgrounds/show', { campground });
});

app.get('/campgrounds/:id/edit', async (req, res) => {
  const { id } = req.params;
  const campground = await Camp.findById(id);
  res.render('campgrounds/edit', { campground });
});

app.put('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  const { name, location } = req.body.campground;
  const campground = await Camp.findByIdAndUpdate(id, {
    name,
    location,
  });
  res.redirect(`/campgrounds/${campground._id}`);
});

app.delete('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  await Camp.findByIdAndDelete(id);
  res.redirect('/campgrounds');
});

app.use((req, res) => {
  res.send('404: PAGE NOT FOUND!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
