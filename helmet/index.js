const connectSrcUrls = [
  'https://api.mapbox.com/',
  'https://a.tiles.mapbox.com/',
  'https://b.tiles.mapbox.com/',
  'https://events.mapbox.com/',
];
const scriptSrcUrls = [
  'https://stackpath.bootstrapcdn.com/',
  'https://api.tiles.mapbox.com/',
  'https://api.mapbox.com/',
  'https://kit.fontawesome.com/',
  'https://cdnjs.cloudflare.com/',
  'https://cdn.jsdelivr.net',
];
const styleSrcUrls = [
  'https://cdn.jsdelivr.net',
  'https://kit-free.fontawesome.com/',
  'https://stackpath.bootstrapcdn.com/',
  'https://api.mapbox.com/',
  'https://api.tiles.mapbox.com/',
  'https://fonts.googleapis.com/',
  'https://use.fontawesome.com/',
];
const fontStyleUrls = ['https://cdn.jsdelivr.net'];

module.exports = {
  defaultSrc: [],
  connectSrc: ["'self'", ...connectSrcUrls],
  scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
  styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
  workerSrc: ["'self'", 'blob:'],
  objectSrc: [],
  imgSrc: [
    "'self'",
    'blob:',
    'data:',
    `https://res.cloudinary.com/${process.env.CLOUD_NAME}/`,
    'https://images.unsplash.com/',
  ],
  fontSrc: ["'self'", ...fontStyleUrls],
};
