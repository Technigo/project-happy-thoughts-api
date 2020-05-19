import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import Thought from './models/thought'

const ERR_CANNOT_FIND_ID = 'Cannot find thought'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())


app.get('/', (req, res) => {
  res.send('Happy Thoughts database')
})

app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: -1}).limit(20).exec()
  res.json(thoughts)
})

app.post('/thoughts', async (req, res) => {
  const { message } = req.body
  const thought = Thought({ message })

  try {
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  } catch (err) {
    res.status(400).json({message: 'Could not save thought to the database', error:err.errors})
  }
})

app.post('/:id/like', async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate({ _id: req.params.id }, { $inc: { hearts: 1 } })
    res.json(thought).status(201);
  } catch (err) {
    res.status(401).json({ message: 'Could not add heart', error: err })
  }
})

/*
app.get('/thoughts/:id', async (req, res) => {
  const { _id } = req.params
  console.log(`GET /thought/${_id}`)
  const thoughtById = Thought.findOne({ _id })
  if (thoughtById) {
    res.status(200).json(thoughtById)
  } else {
    res.status(404).json({message:ERR_CANNOT_FIND_ID })
  }
})
app.post('/:id', async (req, res) => {
  const {hearts} = req.body
  const like= Thought({hearts})

  try {
    const savedLike = await like.save()
    res.status(201).json(savedLike)
  } catch (err) {
    res.status(400).json({ message: 'Could not save like to the database', error: err.errors })
  }
})*/

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
