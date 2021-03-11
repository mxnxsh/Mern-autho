const User = require('../models/user');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  const { name, phoneNumber, email, password, confirmPassword } = req.body;
  try {
    const userEmail = await User.findOne({ email })
    const userPhoneNumber = await User.findOne({ phoneNumber })

    if (userEmail) {
      return res.status(220).json({
        message: 'User already registered',
        data: userEmail
      })
    }
    else if (userPhoneNumber) {
      return res.status(220).json({
        message: 'Phone number already registered',
        data: userPhoneNumber
      })
    }
    else {
      if (password === confirmPassword) {
        
        const newUser = new User({
          name, email, password,phoneNumber
        })
        const token = await newUser.generateAuthToken();
        // res.cookie('jwt', token, {
        //   httpOnly: true,
        //   // secure:true
        // })
        const saveUser = await newUser.save();
        res.status(201).json({
          message: "User registered succesfully",
          data:saveUser
        });
        // res.status(201).redirect('/');
      } else {
        return res.status(401).json({
          message:'Password does not match'
        })
      }
    }
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email })
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password)
      const token = await user.generateAuthToken();
      res.cookie('jwt', token, {
        httpOnly: true,
        // secure:true
      })
      if (isMatch) {
        // res.status(201).redirect('/');
        res.status(201).json({
          message: "User login succesfully",
          data:user
        });
      } else {
        res.send('Email and password incorrect')
      }
    } else {
      res.send('User not registered')
    }
  } catch (error) {
    res.status(511).send(`Email and password incorrect`);
  }
}
module.exports={
  register,
  login
}