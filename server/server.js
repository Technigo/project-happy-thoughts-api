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
    // → Should not be assignable when creating a new thought. For example, if I send a POST request to `/` to create a new thought with this JSON body; `{ "message": "Hello", "hearts": 9000 }`, then the `hearts` property should be ignored, and the object we store in mongo should have 0 hearts.
  },
  createdAt: {
    type: Date,
    default: Date.now
    // → Should not be assignable when creating a new thought
  }
})

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello world')
})

// ### `GET /thoughts`
// This endpoint should return a maximum of 20 thoughts, sorted by `createdAt` to show the most recent thoughts first.
app.get('/thoughts', async (req, res) => {
  const allThoughts = await Thoughts.find().sort({createdAt: 'desc'}).limit(20).exec()
  res.json(thoughts)
})



// ### `POST /thoughts`
// This endpoint expects a JSON body with the thought `message`, like this: `{ "message": "Express is great!" }`. If the input is valid (more on that below), the thought should be saved, and the response should include the saved thought object, including its `_id`.
app.post('/thoughts', async (req, res) => {
  try {
    const newThought = await new Thought(req.body).save()
    res.status(200).json(newThought)
  
  } catch (err) {
    res.status(400).json({message:'Could not save thought', errors: err.errors})
  }
})


// ### `POST thoughts/:thoughtId/like`
// This endpoint doesn't require a JSON body. Given a valid thought id in the URL, the API should find that thought, and update its `hearts` property to add one heart.





app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
