import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import { Thought } from './Models/Models'

require('dotenv').config()

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())

app.get('/', async (req, res) => {
  const hearts = req.query.hearts
  let myFilter = []

  if ( hearts ) {
    myFilter = {
      "hearts": hearts
  }} else {
    myFilter = {
      "createdAt": -1
    }
  }
    
  try {
    const thoughts = await Thought.find().limit(20).sort( myFilter ) 
    res.status(200).json(thoughts)
  } catch(err) {
    res.status(404).send(err)
  }
})

app.post('/', async (req, res) => {
  try {
    await new Thought({ message: req.body.message, name: req.body.name, createdAt: new Date().toISOString()}).save()
    return res.status(200).json(req.body)
  } catch(err) {
    res.status(404).send(err)
  }
  
})

app.post('/:thoughtId/like', async (req, res) => {
  try {
    const { thoughtId } = req.params
    await Thought.updateOne({ _id: thoughtId }, { $inc: { hearts: 1 }})
    res.status(200).json("update successful")
  } catch(err) {
    res.status(404).send(err)
  }
})

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: "Service unavailable"})
  }
})

if (process.env.RESET_DB === "true") {
  const seedDatabase = async () => {
    await Thought.deleteMany({})
  }
  seedDatabase()
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
