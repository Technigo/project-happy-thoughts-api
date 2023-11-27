// Importing express, cors and mongoose
import express from "express"
import cors from "cors"
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

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Imports the Thought model from the map 'models' and file 'thought.js'
const Thought = require('./models/thought')

// Imports the express-list-endpoints library to generate documentation for the API
const listEndpoints = require("express-list-endpoints")

// ----------- Routes starts here --------- //
// Default route to get API documentation (listing all the available endpoints)
app.get("/", (req, res) => {
  const documentation = {
    endpoints: listEndpoints(app),
    additionalInfo: {
      "/thoughts": {
        description: "Description here"
      },
    },
  }

  res.json(documentation)
})

// Route to get (fetches) the 20 latest thoughts from MongoDB database and returns them as a JSON response
app.get('/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
    res.json(thoughts);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch thoughts, please try again', error: error });
  }
});

// Route to create a new thought with input validation to ensure the message length is within bounds
app.post('/thoughts', async (req, res) => {
  try {
    const { message } = req.body;
    // Validate input
    if (!message || message.length < 5 || message.length > 140) {
      return res.status(400).json({ message: 'The message must be between 5 and 140 characters' })
    }

    const newThought = new Thought({ message })
    const savedThought = await newThought.save()
    res.status(201).json(savedThought)
  } catch (error) {
    res.status(400).json({ message: 'Could not save thought, please try again', error: error })
  }
})

// // Test-Route to "like" a thought
// app.post('/thoughts/:thoughtId/like', async (req, res) => {
//   const { thoughtId } = req.params

//   try {
//     const thought = await Thought.findById(thoughtId)

//     if (!thought) {
//       return res.status(404).json({ message: 'Thought not found' })
//     }

//     thought.hearts += 1;
//     const updatedThought = await thought.save()
//     res.json(updatedThought)
//   } catch (error) {
//     res.status(400).json({ message: 'Could not add a thought', error: error })
//   }
// })


// Starts the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})