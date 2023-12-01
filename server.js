// Importing express, cors and mongoose
import express from "express"
import cors from "cors" // Security feature
import mongoose from "mongoose"


// Sets up MondoDB connection using the provided URL or a default local URL
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happy-thought"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable CORS (Cross-Origin Resource Sharing) and json body parsing (breaking down the data into a format that the server can easily work with)
// Tells Express to use the cors middleware for all routes in the application
app.use(cors())
// Tells Express to use this tool for all incoming requests "Hey, if someone send JSON, make sure we can use it without any extra hassle!"
app.use(express.json())

// Imports the Thought model from the map 'models' and file 'thought.js'
const Thought = require('./models/thought')

// Imports the express-list-endpoints library to generate documentation for the API
const listEndpoints = require("express-list-endpoints")


// ----------- Routes starts here --------- //

// Default route to get API documentation (listing all the available endpoints)
app.get("/", (req, res) => {
  const documentation = {
    // Use express-list-endpoints to generate a list of available endpoints
    endpoints: listEndpoints(app),
    additionalInfo: {
      "/thoughts": {
        description: "If necessary a description of the API/endpoints could be added here later on"
      },
    },
  }

  res.json(documentation)
})

// Route to get (fetch) the 20 latest thoughts from MongoDB database and returns them as a JSON response
app.get('/thoughts', async (req, res) => {
  try {
    // Fetches the 20 latest thoughts from the database, sorted by creation time
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
    res.json(thoughts);
  } catch (error) {
    // Handle errors when fetching thoughts
    res.status(500).json({ message: 'Unable to fetch thoughts, please try again', error: error });
  }
});

// Route to create a new thought with input validation to ensure the message length is within bounds
app.post('/thoughts', async (req, res) => {
  try {
    const { message } = req.body;
    // Validate input: ensure the message is between 5 and 140 characters
    if (!message || message.length < 5 || message.length > 140) {
      return res.status(400).json({ message: 'The message must be between 5 and 140 characters' })
    }

    // Create a new Thought instance and save it to the database
    const newThought = new Thought({ message })
    const savedThought = await newThought.save()
    res.status(201).json(savedThought)
  } catch (error) {
    // Handles errors when creating and saving a new thought
    res.status(400).json({ message: 'Could not save thought, please try again', error: error })
  }
})

// Route to "like" a thought
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params

  try {
    // Find the thought by its ID in the database
    const thought = await Thought.findById(thoughtId)

    if (!thought) {
      // Return a 404 status if the thought is not found
      return res.status(404).json({ message: 'Thought not found' })
    }

    // Increment the hearts (likes) count and save the updated thought
    thought.hearts += 1;
    const updatedThought = await thought.save()
    res.json(updatedThought)
  } catch (error) {
    // Handles errors when liking a thought
    res.status(400).json({ message: 'Could not add a thought', error: error })
  }
})
// -------- Routes end here --------- //

// Starts the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})