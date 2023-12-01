const express = require('express'); // Express is a web application framework for Node.js
const expressListEndpoints = require('express-list-endpoints');
const dotenv = require('dotenv').config(); // dotenv is used to load environment variables from a .env file
const cors = require('cors');
// Import the mongoose library, which is a MongoDB object modeling tool for Node.js
const mongoose = require('mongoose');

const mongoUrl = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/happy_thoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}))

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(expressListEndpoints(app));
});

app.use('/', require('./routes/thoughtRoutes'));

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
