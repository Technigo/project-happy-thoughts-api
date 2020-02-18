import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Message for Happy Thought, validation of 5-140 characters, hearts and created date.
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
    default: () => new Date
  }
})


// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

//Middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// ROUTES
app.get('/intro', (req, res) => {
  res.send('Hello lovely world  - we are ready to handle happy thoughts')
})

//GET and POST the Happy Thoughts 
app.get('/', async (req, res) => {
  const thought = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
  try {
    // Success 
    res.status(200).json(thought);
    //No luck
  } catch (err) {
    res.status(400).json({ thought: 'Could not find any Thoughts in the Database', error: err.errors })
  }
})

app.post('/', async (req, res) => {
  // Retrieve the information sent by the Happy Thought client to our API endpoint
  const { message } = req.body

  // Use our mongoose model to create the database entry
  const thought = new Thought({ message })

  try {
    // Success 
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
    //No luck
  } catch (err) {
    res.status(400).json({ thought: 'Could not save the Happy Thought to the Database', error: err.errors })
  }
})

//POST likes of the Happy Thoughts 

app.post('/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params;
  //console.log(`POST /${_id}/like`)

  try {
    await Thought.updateOne({ '_id': thoughtId }, { '$inc': { 'hearts': 1 } })
    // Success 
    res.status(201).json()
    // Failure to count
  } catch (err) {
    res.status(400).json({ thought: 'We could not count the Happy Thought', error: err.errors })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})





