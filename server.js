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

const Thought = mongoose.model('Thought', {

  message: {
    type: String,
    required: true,
    minlength: 2,
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

//IN CASE WE NEED TO CLEAN THE DATABASE: 
//if (process.env.RESET_DB) {
//   const seedDatabase = async () => {
//     await Thought.deleteMany({})

//     .forEach((thoughtRecord) => {
//       new Thought(thoughtRecord).save()
//     })
//   }

//   seedDatabase()
// }

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

// get(read) all the messages posted by the client into the database,
// sort them by date in a descendent way and limit them to 20
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' })
    .limit(20)
    .exec()
  res.json(thoughts)
})

// post(write) your new message into the database! 
app.post('/thoughts', async (req, res) => {
  // Retrieve the information sent by the client to our API endpoint
  const { message } = req.body
  // Use our mongoose model to create the database entry
  const thought = new Thought({ message })
  try {
    // succesfull case, where all the data is correct and we can save it in our database
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  } catch (err) {
    res.status(400).json({ message: 'Message could not be saved', error: err.errors })
  }
})

// When you want to update a message with likes (hearts): 
// 1) Get the message that you want to update (by id)
app.get('/thoughts/:id', (req, res) => {
  Thought.findOne({ id: req.params._id }).then(thought => {
    if (thought) {
      res.json(thought)
    } else {
      res.status(404).json({ error: 'Not found', error: err.errors })
    }
  })
})

// 2) Change the part of the message that you want to update,
//in this case update the likes (increase # of hearts)
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  // Retrieve the information sent by the client to our API endpoint
  // in this case is the id of the thought
  const { thoughtId } = req.params
  // comparing the id received with our db
  const thoughtLiked = await Thought.findById(thoughtId)
  // if the thought is found then we increase the nr of hearts by 1 and save into the db
  if (thoughtLiked) {
    thoughtLiked.hearts += 1
    thoughtLiked.save()
    res.json(thoughtLiked)
    //if not found, send an error message
  } else {
    res.status(404).json({ error: 'Not found', error: err.errors })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
