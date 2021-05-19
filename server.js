import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import listEndpoints from 'express-list-endpoints'
import mongoose from 'mongoose'

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, "The message field is mandatory"],
    validate: {
      validator: (value) => {
        return /^[^0-9]+$/.test(value)
      },
      message: "Numbers are not allowed"
    },
    minlength: 5,
    maxlength: 140,      
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

const Thought = mongoose.model('Thought', thoughtSchema)

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send(listEndpoints(App))
})


 
app.get('/thoughts', async (req, res) => {
  const allThoughts = await Thought.find().sort({ createdAt: -1 }).limit(20).exec();
  res.json(allThoughts);
});



app.post('/thoughts', async (req, res) => {
  try {
  const newThought = await new Thought(req.body).save()
  res.json(newThought)
} catch (error) {
  if (error.code === 11000) {
    res.status(400).json({ error: 'Duplicated value', fields: error.keyValue })
  } res.status(400).json(error)
}
})

app.post('/thoughts/:thoughtId/likes', async (req, res) => {
  const { thoughtId } = req.params;

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

app.delete('/thoughts/:thoughtId', async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const deletedThought = await Thought.findOneAndDelete({ _id: thoughtId });
    if (deletedThought) {
      res.json(deletedThought);
    } else {
      res.status(404).json({ message: 'Not found' })
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error });
  }
});




// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
