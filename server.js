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
    maxlength: 140
  },
  heart: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now

  }
})


//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Thought.deleteMany({})

    data.forEach((thought) => {
      new Thought(thought).save()
    })
  }

  seedDatabase()
}

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/thoughts', async (req, res) => {
  const thought = await Thought.find().sort({ createdAt: 'desc', heart: +1 }).limit(20).exec()
  res.json(thought)
})

app.post('/thoughts', async (req, res) => {
  //Retrieve the information sent by the client to our API endpoint
  const { message } = req.body
  //use our mongoose model to create the database entry
  const thought = new Thought({ message })

  try {
    //Success
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  } catch (err) {
    res.status(400).json({ message: 'Could not save thought to the Database', error: err.errors })

  }

})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
