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
    maxlength: 140,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  user: {
    type: String,
    default: 'Anonymous'
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
})

const port = process.env.PORT || 2500
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here

const myEndpoints = require('express-list-endpoints')
app.get('/', (req, res) => {
  res.send(myEndpoints(app))
})

// app.get('/', (req, res) => {
//   res.send('Hello world, welcome to Katarinas Happy Thoughts API')
// })

//Handling erorrs by summing them in consts
const COULD_NOT_SAVE_THOUGHT = "Sorry! Could not save thought to the database";
const COULD_NOT_FIND_THOUGHT_WITH_ID = "Sorry! Unable to find the thought with the ID: ";
const COULD_FIND_THOUGHT = "Added one more like";

//GET AND POST THOUGHTS
app.get('/thoughts', async (req, res) => {
  const {page} = req.query

  //Pagination
  const pageNo = +page || 1
  const itemPerPage = 20
  const next = itemPerPage * (pageNo - 1)

  const allThoughts = await Thought.find()
  const pages = Math.ceil(allThoughts.length / itemPerPage)

  const thoughts = await Thought.find().sort({createdAt: -1}).limit(itemPerPage).next(next).exec()
  res.json({thoughts: thoughts, pages:pages})
})

app.post('/thoughts', async (req, res) => {
  const {message, hearts, user} = req.body
  const thought = new Thought({message: message, hearts: hearts, user: user})

  try {
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  } catch (err) {
    res.status(400).json({message: COULD_NOT_SAVE_THOUGHT, error: err.errors})
  }
})

//MANAGING POST FOR LIKES
app.post('/:thoughtID/like', async (req, res) => {
  const { thoughtID } = req.params;

  try {
    await Thought.updateOne({ _id: thoughtID }, { $inc: { hearts: 1 } });
    res.status(201).json({ message: COULD_FIND_THOUGHT });
  } catch (err) {
    res.status(404).json({
      message: `${COULD_NOT_FIND_THOUGHT_WITH_ID} ${thoughtID}`,
      error: err.errors,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
