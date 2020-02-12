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
});

  
// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Thought.deleteMany({})

    thoughts.forEach ((thought) => {
      new Thought(thought).save()
    })
  }

  seedDatabase()
}


//Creating one GET-endpoint
app.get('/', async (req, res) => {
  const thought = await Thought.find().sort({ createdAt: 'desc', heart: +1 }).limit(20).exec();
  res.json(thought)
})

app.post('/', async (req,res) => {
const { message } = req.body;

const thought = new Thought ({ message });

try {
  const savedThought = await thought.save()
  res.status(201).json(savedThought);
} catch (err) {
  res.status(400).json({ message: 'Could not save thought to database', error: err.errors });
}
});

app.post('/:thoughtId/like', async (req,res) => {
  const thoughtId = req.params.thoughtId 

  try {
    const likedThought = await Thought.findByIdAndUpdate(thoughtId, { $inc: {'heart': 1} }, {new: true})
    res.status(201).json(likedThought)
  } catch (err) {
    res.status(400).json({message: 'Could not like thought', error: err.errors });
  }
}) 



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
