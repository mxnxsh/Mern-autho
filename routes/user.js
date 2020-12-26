const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

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
router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  try {
    const user = await User.findOne({ email })
    if (user) {
      res.send('User already registered')
    } else {
      if (password === confirmPassword) {
        const newUser = new User({
          name, email, password
        })
        const token = await newUser.generateAuthToken();
        res.cookie('jwt', token, {
          expires: new Date(Date.now() + 100 * 100 * 100),
          httpOnly: true,
          // secure:true
        })
        const saveUser = await newUser.save();
        res.status(201).redirect('/');
      } else {
        res.send(`Password does not matching`)
      }
    }
  } catch (error) {
    res.status(400).send(`${error}`)
  }
});

/**
 * GET login
 */
router.get('/login', (req, res) => {
  res.render('login')
});

/**
 * POST login
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email })
    if (user) {
      const isMatch = bcrypt.compare(password, user.password)
      const token = await user.generateAuthToken();
      res.cookie('jwt', token, {
        expires: new Date(Date.now() + 100 * 100 * 100),
        httpOnly: true,
        // secure:true
      })
      if (isMatch) {
        res.status(201).redirect('/');
      } else {
        res.send('Email and password incorrect')
      }
    } else {
      res.send('User not registered')
    }
  } catch (error) {
    res.status(511).send(`Email and password incorrect`);
  }
});

module.exports = router 