import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

//The Mogoose model 
const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: [true, "Hey, you need to write a message!"],
    minLength: 5,
    maxLength: 140,
  },

  hearts: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
})


// Defines the port the app will run on. Defaults to 8080
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

//GET request 
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find()
    .sort({ createdAt: 'desc' })
    .limit(20)
    .exec()

  res.status(200).json(thoughts);
})

//POST request
app.post('/thoughts', async (req, res) => {
  //The try statement allows you to define a block of code to be tested for errors while it is being executed.
  try {
    const postThought = await new Thought(req.body).save()
    res.status(200).json(postThought)
  }
  catch (error) {
    res.status(400).json({
      success: false,
      message: 'Could not post thought',
      errors: error.errors
    })
  }
})

app.patch('thoughts/:id', async (req, res) => {
  await Thought.updateOne({ _id: req.params.id }, req.body)
  res.status(200)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
