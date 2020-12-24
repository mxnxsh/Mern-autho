const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/user');

router.get('/', (req, res) => {
  res.render('index')
});
router.get('/register', (req, res) => {
  res.render('register')
});
router.get('/secret', (req, res) => {
  console.log(req.cookies.jwt);
  res.render('secret')
});
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
          expires: new Date(Date.now() + 60000),
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
router.get('/login', (req, res) => {
  res.render('login')
});
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email })
    if (user) {
      const isMatch = bcrypt.compare(password, user.password)
      const token = await user.generateAuthToken();
      res.cookie('jwt', token, {
        expires: new Date(Date.now() + 60000),
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