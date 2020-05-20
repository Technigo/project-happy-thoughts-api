import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import Thought from './model/Thought'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


if (process.env.RESET_DATABASE) {
  console.log('Resetting database...');

  const deleteDatabase = async () => {
      await Thought.deleteMany();
      console.log(`Deleting databse`)
  };
  deleteDatabase();
}

const port = process.env.PORT || 8080
const app = express()
const listEndpoints = require('express-list-endpoints')

app.use(cors())
app.use(bodyParser.json())

// Root
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

// GET All Thoughts sort by createdAt
// Limit to 20
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec()
  res.json(thoughts)
})

// POST new thought
// This enpoind expects a json body with thought message like:
app.post('/thoughts', async (req, res) => {
  const { message, hearts } = req.body
  const thought = new Thought({ message, hearts })

  try{
    const savedThought = await thought.save()
    res.status(200).json(savedThought)
  } catch (err) {
    res.status(400).json({ message: 'Could not save thought to the databse' , error:err.errors})
  }
})

// POST /thoughtId/like
//This endpoint doesn't require a JSON body. Given a valid thought id in the url, tha api should find that thought and uptade its hearts property to add one heart


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
