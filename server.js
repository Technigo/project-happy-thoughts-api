import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })


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


//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())
//error handling when the database is down or out of reach
app.use((res, req, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})


app.get('/', (req, res) => {
  res.send('Hello world')
})

//Path param route, with endpoint /thoughts. using get method
app.get('/thoughts', async (req, res) => {
  try {
    //Success
    const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
    res.status(200).json(thoughts)
  } catch (err) {
    res.status(400).json({ message: 'Could not get thoughts', error: err.errors })
  }
})

// POST A THOUGHT
app.post('/thoughts', async (req, res) => {
  //Retrieve the information sent by the client to our API endpoint
  const { message } = req.body
  //use our mongoose model to create the database entry
  const thought = new Thought({ message })

  try {
    //Success
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  } catch (err) {
    res.status(400).json({ message: 'Could not save your thought to the Database', error: err.errors })
  }
})

// LIKE A THOUGHT
app.post('/:thoughtId/like', async (req, res) => {
  // This endpoint should update the heart Number

  try {
    //Success
    const like = await Thought.findOneAndUpdate(
      { "_id": req.params.thoughtId },
      { $inc: { "hearts": 1 } },
      { returnNewDocument: true } // returns the new updated thought
    )
    res.status(201).json(like)
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: 'Could not save your like to the Database', error: err })
  }

})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
