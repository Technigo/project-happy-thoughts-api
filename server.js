import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

//populate database function - why is it needed?

//model
const Thought = mongoose.model("Thought", {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  heart: {
    type: Number,
    //TODO: default not working yet - can assign nr of my choice to it!
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
    //Should not be assignable when creating a new thought
  }
})

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello, welcome to happy thoughts API')
})

app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: "desc" }).limit(20).exec()
  res.json(thoughts)
})

//endpoint for posting thoughts
app.post("/thoughts", async (req, res) => {
  //retrieve the info sent by the client to our API endpoint
  const { message } = req.body

  //use mongoose model to create the DB entry
  const thought = new Thought({ message })

  //save the entry
  try {
    //success
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  } catch (err) {
    res.status(400).json({ message: "Couldn't save thought to the database.", error: err.errors })

  }
})

//endpoint for posting likes/hearts
app.post("/thoughts/:thoughtId/heart", async (req, res) => {
  const thoughtId = req.params.thoughtId
  // const heart = req.body

  //increment the nr of hearts for the thought with specific id
  await Thought.updateOne({ _id: thoughtId }, { $inc: { heart: 1 } })

  res.status(201).json()


  // try {
  //   const savedLike = await like.save()
  //   res.status(201).json(savedLike)

  // } catch (err) {
  //   res.status(400).json({ message: "Couldn't save the like.", error: err.errors })
  // }

})



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
