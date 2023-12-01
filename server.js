const express = require('express'); // Web application framework for Node.js
const expressListEndpoints = require('express-list-endpoints');
const dotenv = require('dotenv').config(); // Load environment variables from a .env file
const cors = require('cors');
const mongoose = require('mongoose'); // MongoDB object modeling tool for Node.js

// MongoDB connection setup
const mongoUrl = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/happy_thoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Disable strict query mode to allow MongoDB queries with fields not defined
// in the Mongoose schema.
mongoose.set('strictQuery', false);

const port = process.env.PORT || 8080; // Default port is 8080, can be overridden with PORT env variable
const app = express();

// Middlewares
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded request bodies

// Endpoint for listing all routes
app.get("/", (req, res) => {
  res.send(expressListEndpoints(app));
});

// Routes
app.use('/', require('./routes/thoughtRoutes'));

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
