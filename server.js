import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

//Schema for thought model
const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: (value) => {
        return /^[^0-9]+$/.test(value)
      },
      message: "Numbers are not allowed. Try again, please."
    },
    minlength: [5, "Your message is too short. Min 5 characters, please."],
    maxlength: [140, "Your message is too long. Max 140 characters, please."]
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

//Thought model
const Thought = mongoose.model('Thought', thoughtSchema)

//List of endpoints
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

//Endpoint that will display the happy thoughts stored in the database
app.get('/thoughts', async (req, res) => {
  const allThoughts = await Thought.find().sort({ createdAt: -1 });
  res.json(allThoughts);
});

//Endpoint to post a new thought by user
app.post('/thoughts', async (req, res) => {
  try {
  const newThought = await new Thought(req.body).save()
  res.json(newThought)
  } catch (error) {
    if (error.code === 11000) {
    res.status(400).json({ message: 'Duplicated value', fields: error.keyValue })
  }
  res.status(400).json(error)
  }
})

//POST request to increase amount of hearts
app.post('/thoughts/:id/likes', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedThought = await Thought.findOneAndUpdate(
      {
        _id: id
      },
      { 
        $inc: {
          hearts: 1
        }
      },
      {
        new: true
      }
    );
    if (updatedThought) {
      res.json(updatedThought);
    } else {
      res.status(404).json({ message: 'Not found' })
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error });
  }
});

//Endpoint to delete a thought
app.delete('/thoughts/:id', async (req, res) => {
  const { id } = req.params

  try {
    const deletedThought = await Thought.findByIdAndDelete({ id });
    if (deletedThought) {
      res.json(deletedThought);
    } else {
      res.status(404).json({ message: 'Not found' })
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
