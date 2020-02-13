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
    // Should not be assignable when creating a new thought. For example, if I send a POST request to / to create a new thought with this JSON body; { "message": "Hello", "hearts": 9000 }, then the hearts property should be ignored, and the object we store in mongo should have 0 hearts.
  },
  createdAt: {
    type: Date,
    default: Date.now()
    // default: () => new Date
    // Should not be assignable when creating a new thought.
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
  const thought = await new Thought(req.body).save();

  // const thought = new Thought(req.body);
  // const savedThought = await thought.save();
  res.json(thought);
});



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
  console.log('tjabbaa')
})
