import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughtsNM"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength:  140
  },
  name: {
    type: String,
    maxlength: 30,
    default: 'Anonymous'

  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});


if (process.env.RESET_DATABASE) {
  console.log('Resetting database!');
const seedDatabase = async () => {

  await Thought.deleteMany();
  }
  seedDatabase();
}

const port = process.env.PORT || 8080
const app = express()

const listEndpoints = require('express-list-endpoints')

app.use(cors())
app.use(bodyParser.json())

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service Unavailable' })
  }
})


app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find()
      .sort({createdAt: 'desc'})
      .limit(20)
      .exec();
      res.json(thoughts);
});

app.post('/thoughts', async (req, res) => {
  const { message, name } = req.body;
  const thought = new Thought({ message, name });

  try {
    const savedThought = await thought.save();
    res.status(200).json(savedThought);
  } catch (err) {
    res.status(400).json({ message: 'Could not save the happy thought to the database', error: err.errors});
  }
});

//? put instead of post because updating existing hearts data, increments by one
app.put('/thoughts/:thoughtId/like', async (req,res) => {
  const { thoughtId } = req.params
  
  try {
  const updatedHearts = await Thought.findOneAndUpdate({ _id: thoughtId }, {$inc: { hearts: 1 }})
    res.status(200).json(updatedHearts)
  } catch (err) {
    res.status(404).json({ message: 'Could not find ThoughtId, update not possible', errors: err.errors});
  };
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})