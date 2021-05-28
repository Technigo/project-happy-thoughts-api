import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
// eslint-disable-next-line max-len
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
mongoose.Promise = Promise

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String, 
    required: [true, 'Message is required!'], 
    trim: true,
    minlength: [5, 'You have to have at least 5 character and I just got {VALUE}'],
    maxlength: 140
  }, 
  hearts: {
    type: Number,
    default: 0
  },
  username: {
    type: String,
    default: 'Anonymous' 
  },
  hashtag: {
    type: Array, 
    default: []
  },
  createdAt: {
    type: Date, 
    default: Date.now
  }
})

const Thought = mongoose.model('Thought', thoughtSchema)

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

app.get('/thoughts', async (req, res) => {
  const { page = 1, size = 20 } = req.query
    
  // const countAllThoughts = await Thought.countDocuments() 

  try {
    const thoughts = await Thought
      .find()
      .limit(Number(size))
      .skip((page - 1) * size)
      .sort({ createdAt: 'desc' })
      .countDocuments({}) 
      .exec()

    res.json({  
      data: thoughts,
      totalPages: Math.ceil(thoughts / size),
      currenPage: page
    })
  } catch (error) {
    res.status(400).json(error)
  }
})

app.post('/thoughts', async (req, res) => {
  const tags = req.body.message.trim().split(' ').map((item) => ` #${item}`)

  const tagsUnique = []

  tags.forEach((item) => {
    if (!tagsUnique.includes(item)) {
      tagsUnique.push(item)
    } 
  }) 

  try {
    const newThought = await new Thought(
      { 
        message: req.body.message, 
        username: req.body.username,
        hashtag: tagsUnique 
      }
    ).save()
    res.status(200).json(newThought)
  } catch (error) {
    res.status(400).json(error)
  }
})

app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params 

  try {
    const updatedThought = await Thought.findOneAndUpdate(
      {
        _id: thoughtId
      }, 
      { 
        $inc: { 
          hearts: 1 
        } 
      }, 
      {
        new: true
      }
    )
    if (updatedThought) {
      res.json({ data: updatedThought })
    } else {
      res.status(404).json({ message: 'Not found!' })
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error })
  } 
})

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
