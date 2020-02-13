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
    // Måste vara default 0 annars följer den inte med om jag itne sj skriver t.ex. heart: 1
    // Klart: Should not be assignable when creating a new thought
  },
  createdAt: {
    type: Date,
    default: Date.now()
    // default: () => new Date
    //Klart: Should not be assignable when creating a new thought.
  }
});

// Testing validation:
// new Thought({ message: 'hej hej ' }).save()

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
  res.send('Hello hello')
  // const thoughts = res.
})

app.post('/thoughts', async (req, res) => {

  //try catch-form
  try {
    //success
    const { message } = req.body
    const thought = await new Thought({ message }).save();
    res.status(200).json(thought);
  } catch (err) {
    //Bad request
    res.status(400).json({ message: 'Could not post thought', errors: err.errors })
  }

  // const thought = new Thought(req.body);
  // const savedThought = await thought.save();

});



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
  console.log('tjabbaa')
})
