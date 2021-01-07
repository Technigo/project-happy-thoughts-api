import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start

const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
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
  }
})

const port = process.env.PORT || 8081
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('This is the Happy Thoughts API by Caroline Birgersson')
})

app.get('/thoughts', async (req, res) => { //finds the added thoughts
  try {
    const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec()
    res.status(201).json(thoughts)
  } catch (err) {
    res.status(400).json({message: 'could not load the database' })
  }
})

app.post('/thoughts', async (req, res) => { //creates a thought
  try {
    const {message, hearts} = req.body 
    const thought = new Thought({message: message, hearts: hearts}) // this structure makes the user not able to manipulate the input

    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  } catch (err) {
    res.status(400).json({message: "could not save thought to the database", error: err.errors})
  }
})

app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const {thoughtId} = req.params
  try {
    await Thought.updateOne({ _id: thoughtId }, { $inc: { hearts: 1 } });
    res.status(200).json(thoughtId)
  } catch (err) {
      res.status(404).json({message: "could not add heart by the id", 
      error: err.errors})
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
