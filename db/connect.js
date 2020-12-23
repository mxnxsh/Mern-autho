const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mernAutho', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(() => {
  console.log(`MongoDB is connected Successfully`);
}).catch((error) => {
  console.log(error);
});