import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

mongoose.connection.once("open", () => {
  console.log("Got the mongoDb connection 🥂")
})

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// THoughts model

const Thought = mongoose.model("Thought", {

  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 120
  },
  hearts: {
    type: Number,
    /*  default: 0  - better here or below?*/
  },
  createdAt: {
    type: Date,
    default: () => new Date() // or default: Date.now??
  },
  tag: {
    type: String
  }
})

// Start defining your routes here
app.get('/', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: "desc" }).limit(20)
  res.json(thoughts)
})

/* app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: "desc" }).limit(20).exec() WHY .exec()??
  res.json(thoughts)
}) */

app.post("/", async (req, res) => {
  //get the info from api
  //const { message } = req.body <- why not, used in other code along?
  // create database entry
  const thought = new Thought({
    message: req.body.message,
    hearts: 0,
    tag: req.body.tag
  })
  try {
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  } catch (err) {
    res.status(400).json({ message: "Sorry cant save task to Database", error: err.errors })
  }
})

app.post("/:id/like", async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { hearts: 1 } }
    )
    res.json(thought)
  } catch (err) {
    res.status(400).json({ message: "OhhOh, fix hearts to update" })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
