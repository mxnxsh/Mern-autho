const express = require('express');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();

require('./db/connect')

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.json());
// redirect public files
app.use(express.static("public"));
// redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'));
// redirect CSS bootstrap
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

const user = require('./routes/user')
app.use('/', user);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
})
