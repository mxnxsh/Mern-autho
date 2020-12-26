const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const verifiedUser = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ _id: verifiedUser._id });
    req.token = token;
    req.user = user
    next();
  } catch (error) {
    res.status(401).send(error);
    // console.log(error);
  }
}
module.exports = auth;