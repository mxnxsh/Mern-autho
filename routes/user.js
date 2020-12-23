const express = require('express');
const router = express.Router();
const User = require('../models/user')

router.get('/', (req, res) => {
  res.render('index')
});
router.get('/register', (req, res) => {
  res.render('register')
});
router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  try {
    if (password === confirmPassword) {
      const newUser = new User({
        name, email, password
      })
      const saveUser = await newUser.save();
      res.status(201).render('index')
    } else {
      res.send(`Password does not matching`)
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
    const user = await User.findOne({ email }, (err, user) => {
      if (user) {

        if (user.password === password) {
          res.status(201).render('index');
        } else {
          res.send('Email and password incorrect')
        }
      } else {
        res.send('User not registered')
      }
    })
  } catch (error) {
    console.log(error);
  }
});
module.exports = router 