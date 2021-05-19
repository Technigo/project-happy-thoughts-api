import express from 'express'
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

const thoughtSchema = new mongoose.Schema ({
  message: {
    type: String,
    minlength: 5,
    maxlength: 140
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  userName: {
    type: String,
    default: "Anonymous"
  }
})

const Thought = mongoose.model ("Thought", thoughtSchema)

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get("/thoughts", async (req, res) => {
  // find().sort({createdAt: "desc"}).limit(amount ? amount : 10).exec()
  const page = Math.max(0, req.query.page)
  const perPage = 1
  const amountOfThoughts = await Thought.estimatedDocumentCount()

  const thoughts = await Thought.find()
    .limit(perPage)
    .skip(perPage * page)
    .sort({
        createdAt: "desc"
    })
  res.json({thoughts, amountOfThoughts})
})

app.post("/thoughts", async (req, res) => {
  try {
    const { message, userName } = req.body
    const newThought = await new Thought({message, userName}).save()
    res.json(newThought)
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({error: "The thought should have a length between 5 and 140 characters"})
    } else {
      res.status(400).json({error: "Something went wrong"})
    }
  }
})

app.post("/thoughts/:id/like", async (req, res) => {
  try {
    const { id } = req.params
    const likedThought = await Thought.findById(id)
    const updatedThought = await new Thought ({
      message: likedThought.message, 
      createdAt: likedThought.createdAt, 
      hearts: likedThought.hearts+1,
      userName: likedThought.userName
    }).save()
    await Thought.findByIdAndDelete(id)
    res.json({updatedThought})
  } catch (error) {
  res.status(404).json({error: "Thought not found"})
}
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
