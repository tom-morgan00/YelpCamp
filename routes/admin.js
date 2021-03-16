const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
  if (req.query.password === 'hello') {
    return next();
  } else {
    res.send('You must enter the password');
  }
});

router.get('/secret', (req, res) => {
  res.send('HERE IS THE SECRET!');
});

router.get('/anothersecret', (req, res) => {
  res.send('HERE IS THE SECRET!');
});

module.exports = router;
