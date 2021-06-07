import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.Promise = Promise


const port = process.env.PORT || 8080
const app = express()

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    // enum:["Alfie is best dog", "frasse is cool too"]
    // match: /^[^0-9]+$/,
    validate: {
      validator: (value) => {
        return /^[^0-9]+$/.test(value);
      },
      message: "Numbers are not allowed"
    },
    minlength: 5,
    maxlength: 140
  },
  hearts: {
    type: Number,
    default: 0 //should have this default value always
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Thought = mongoose.model('Thought', thoughtSchema);

app.use(cors())
app.use(express.json())

// Routes
app.get('/', (req, res) => {
  res.send('Hello world')
});

app.post('/thoughts', async (req, res) => {
  try {
    const newThought = await new Thought(req.body).save();
    res.json(newThought);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Duplicated value', fields: error.keyValue })
    }
  res.status(400).json(error);
  }
});

app.delete('/thoughts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedThought = await Thought.deleteOne({ _id: id });
    res.json(deletedThought);
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
