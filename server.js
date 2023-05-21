// Importing express library to create the server
import express from "express";
// Importing cors to allow or deny cross-origin requests
import cors from "cors";
// Importing mongoose to interact with MongoDB
import mongoose from "mongoose";

// Getting the MongoDB connection string from environment variables
// If it is not set, use the local MongoDB instance
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts-api";

// Connecting to MongoDB using the connection string
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
// Use JavaScript built-in Promises in mongoose
mongoose.Promise = Promise;

// Getting the Schema constructor from mongoose
const { Schema } = mongoose;

// Creating a schema for our Thought model
const thoughtSchema = new Schema({
  message: { // This will store the main thought message
    type: String, // It must be a string
    required: true, // It's required
    unique: true, // It must be unique
    minlength: 2, // Minimum length is 5 characters
    maxlength: 140, // Maximum length is 140 characters
    trim: true // Trims unnecessary whitespaces
  },
  hearts: { // This will store the number of likes (hearts)
    type: Number, // It must be a number
    default: 0 // The default value is 0
  },
  name: { // This will store the author's name
    type: String, // It must be a string
    required: true, // It's required
    minlength: 2, // Minimum length is 2 characters
    maxlength: 14 // Maximum length is 14 characters
  },
  createdAt: { // This will store the date of the thought creation
    type: Date, // It's a date
    default: new Date() // The default value is the current date
  },
});

// Creating a mongoose model from our schema
const Thought = mongoose.model("Thought", thoughtSchema);

// The port our server will listen to. Defaults to 8080 if PORT environment variable is not set
const port = process.env.PORT || 8080;

// Creating our express server
const app = express();

// Using cors middleware to handle cross-origin requests
app.use(cors());
// Using express's json middleware to parse JSON bodies of incoming requests
app.use(express.json());

// We're using the 'express-list-endpoints' package to list all endpoints on the root route ("/")
const listEndpoints = require('express-list-endpoints');

// Defining the root route. It responds with a list of all routes
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

// Defining the "/thoughts" GET route. It responds with a list of 20 thoughts, sorted by creation date
app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec();
  res.json(thoughts);
});

// Defining the "/thoughts" POST route. It saves a new thought and responds with the saved thought
app.post('/thoughts', async (req, res) => {
  // Retreieve the information sent by the client to our API endpoint:
  const { message, name } = req.body;
  // Use our mongoose model to create the database entry:
  const thought = new Thought({ message, name });
  try {
    // Save the thought to the database
    const savedThought = await thought.save();
    // Respond with the saved thought
    res.status(201).json(savedThought);
  } catch (err) {
    // If there was an error, respond with the error message and a 400 status code
    res.status(400).json({ message: 'Could not save thought', errors: err.errors });
  }
});

// Defining the "/thoughts/:_id" GET route. It responds with a single thought based on the id
app.get('/thoughts/:_id', async (req, res) => {
  try {
    const singleThought = await Thought.findById(req.params._id);
    if (singleThought) {
      res.status(200).json({
        message: "One single thought",
        success: true,
        body: singleThought
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Couldn't find one single thought. Double check the ID you are using"
        }
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      body: {
        message: error
      }
    })
  }
});

// Defining the "/thoughts/:_id/like" POST route. It increases the heart count of a thought by 1
app.post('/thoughts/:_id/like', async (req, res) => {
  try {
    const singleThought = await Thought.findById(req.params._id);
    if (singleThought) {
      singleThought.hearts += 1;
      await singleThought.save();
      res.status(200).json({
        success: true,
        message: "You gave successfully a heart to that thought",
        singleThought: singleThought
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "You couldn't give a heart to that thought. Double check the ID you are using"
        }
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      body: {
        message: "Server error",
        error: error
      }
    })
  }
});

// Defining the "/thoughts/:_id" DELETE route. It deletes a thought based on the id
app.delete('/thoughts/:_id', async (req, res) => {
  try {
    const deletedThought = await Thought.findByIdAndDelete(req.params._id);
    if (deletedThought) {
      res.status(200).json({
        success: true,
        message: "You deleted successfully that thought",
        deletedThought: deletedThought
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "We could not delete that thought. Double check the ID you are using."
        }
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      body: {
        message: "Server error",
        error: e
      }
    });
  }
});

// Start the server
app.listen(port, () => {
  // This function will run once the server is up and running
  console.log(`Server running on http://localhost:${port}`);
});

