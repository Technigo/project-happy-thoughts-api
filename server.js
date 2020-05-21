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
  const { message, hearts } = req.body
  const thought = Thought({ message, hearts })

  try {
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  } catch (err) {
    res.status(400).json({message: 'Could not save thought to the database', error:err.errors})
  }
})

app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params
  await Thought.findOneAndUpdate({ _id: thoughtId }, { $inc: {hearts: 1} })
  res.status(201).json
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
