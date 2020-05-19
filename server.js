import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import Thought from './models/thought'


const ERR_CANNOT_FIND_Thought = 'Cannot find thought'

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

app.use((req, res, next) =>{
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable'})
  }
})

if (process.env.RESET_DB) {
  console.log('reseting the database...')
  const seedDatabase = async () => {
    await Thought.deleteMany()
    // Send all the json from Thought
    await Thought.forEach((happy) => new Thought(happy).save())
  }
  seedDatabase()
}

// Start defining your routes here
  app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/GET', async (req, res) => {
  const happyThoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()

  if (happyThoughts) {
    res.status(201).json(happyThoughts)
  } else {
    res.status(401).json({ message: ERR_CANNOT_FIND_Thought })
  }

})

app.post('/POST', async (req, res) => {
  const { message } = req.body
  console.log( `message: ${message}` )
  const happyThought = new Thought({ message })
  try {
    const savedThought = await happyThought.save()
    res.status(201).json(savedThought)
  } catch (err) {
    res.status(400).json({ message: 'Could not save thought to the database', error: err.errors })
  }
})
app.post('/POST/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params
  console.log(`POST /POST/ ${thoughtId}/like`)
  await Thought.updateOne({ _id: thoughtId }, { $inc: { hearts: 1 } })
  res.status(201).json()
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
