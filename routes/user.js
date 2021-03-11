const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {register,login} =require('../controllers/user.js')
/**
 * GET index page
 */
router.get('/', (req, res) => {
  res.render('index');
});

/**
 * GET secret page
 */
router.get('/secret', auth, (req, res) => {
  res.render('secret');
});

/**
 * GET logout
 */
router.get('/logout', auth, async (req, res) => {

  // single device logout
  // req.user.tokens = req.user.tokens.filter((currUser) => {
  //   return currUser.token !== req.token;
  // });

  // multiple device logout
  req.user.tokens = []

  res.clearCookie('jwt');
  await req.user.save();
  res.redirect('login');
});

/**
 * GET register page
 */
router.get('/register', (req, res) => {
  res.render('register');
});

/**
 * POST register
 */
router.post('/register', register);

/**
 * GET login
 */
router.get('/login', (req, res) => {
  res.render('login')
});

/**
 * POST login
 */
router.post('/login', login);

module.exports = router 