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

app.use(cors())
app.use(bodyParser.json())

// Root
app.get('/', (req, res) => {
  res.send('Root, short description here.')
})

// GET All Thoughts sort by createdAt
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec()
  res.json(thoughts)
})

// POST new thought
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


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
