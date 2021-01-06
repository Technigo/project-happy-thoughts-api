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
    maxlength:  140
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


//! Create thoughtsData

//? reset database
if (process.env.RESET_DATABASE) {
  console.log('Resetting database!');
const seedDatabase = async () => {

  await Thought.deleteMany();
  }
  seedDatabase();
}

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/thoughts', async (req, res) => {
  //? get thoughts data sort by createdAt, descending order
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec();
  res.json(thoughts);
});

app.post('/thoughts', async (req, res) => {
//? retrieve info sent by client t0 API endpoint, excl hearts
  const { message } = req.body;
//? use mongoose model to create database entry
  const thought = new Thought({ message });

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
  const updatedHearts = await Thought.findOneAndUpdate({ _id: thoughtId }, {$inc: { heart: 1 }})
    res.status(200).json(updatedHearts)
  } catch (err) {
    res.status(400).json({ message: 'Could not find ThoughtId, update not possible', errors: err.errors});
  };

});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
