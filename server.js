import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import Thought from './models/thoughts'

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

// Start defining your routes here
// app.get('/', (req, res) => {
//   res.send('Hello world')
// })


app.get('/', async (req, res) => {
  const { page = 1, tag, likes = 0, sort, order } = req.query
  const limit = 20
  // const query = { tag: tag }
  // const thoughts = await Thought.find({ likes }).sort({ createdAt: 'desc' }).limit(limit).skip(limit * (page - 1))
  const thoughts = await Thought.find({ likes: { $gte: likes } }).sort({ createdAt: 'desc' }).limit(limit).skip(limit * (page - 1))
  const total = (await Thought.find()).length
  const pages = Math.ceil(total / limit)

  if (thoughts.length > 0) {
    res.json({ pages, total, thoughts })
  } else {
    res.status(404).json({ error: "No thoughts found" })
  }

})


app.post('/', async (req, res) => {
  const { name, message, tag } = req.body
  const thought = new Thought({ name, message, tag })

  try {
    const savedThought = await thought.save();
    res.status(201)
      .json(savedThought)
  } catch (err) {
    res.status(400)
      .json({ message: "Could not post ", errors: err.errors })
  }
})


app.post('/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params
  try {
    const thought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $inc: { likes: 1 } },
      { useFindAndModify: false },
    )
    console.log(thought)
    res.status(200)
      .json(thought)
  } catch (err) {
    res.status(400).json({ message: 'Could not like post', error: err })
  }
})

app.post('/:thoughtId/delete', async (req, res) => {

})

app.post('/:thoughtId/edit', async (req, res) => {

})



// deploy to heruko and db 

// filtering and sorting
// choose to sort by oldest first, or only show thoughts which have a lot of hearts

// edit with time limit

// Delete

// fork frontend


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
