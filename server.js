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
    maxlenght: 140
  } ,
  heart: {
    type: Number, 
    default: 0
  } ,
  createdAt: {
    type: Date,
    default: () => new Date()
  }
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Thought.deleteMany()

    booksData.forEach((item) => {
      new Thought(item).save()
    }) 
  }
  seedDatabase()
}

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/thoughts', (req, res) => {
  res.send('hello new')
})

app.post('/thoughts', async (req, res) => {
  try {
    const { message } = req.body 
    const thought = new Thought({ message })
    await thought.save()
    res.status(200).json(thought)
    res.json(thought)
  } catch (err) {
  res.status(400).json({ message: 'could not post happy thought', errors:err.errors})
}
})

//res.join(savedthought)

app.post('thoughts/:thoughtId/like', (req, res) => {

}) 
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
