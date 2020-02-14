import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

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

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
// app.get('/', (req, res) => {
//   res.send('Happy')
// })

app.get('/', async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec()
  res.json(thoughts)
})

app.post('/', async (req, res) => {
  //Retrieve the information sent by the client to our API endpoint
  const {message, hearts} = req.body

  // Use our mongoose model to create the database entry
  const thought = new Thought({message, hearts})

  try {
    // Success
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  }catch (err) {
    res.status(400).json({message: 'Could not save your sweet message', error: err.errors}) 
  }
})

 // The endpoint updates the number of likePOST /:thoughtId/like
app.post('/:thoughtId/like', async (req, res) => {
  
  try {
    const like = await Thought.findOneAndUpdate(
      { "_id": req.params.thoughtId }, //filter
      { $inc: { "hearts": 1 } },//update
      { returnNewDocument: true } //doesn't update/work 
    )
    res.status(201).json(like)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: 'Ups, I could not save your sweet like', error: err })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
