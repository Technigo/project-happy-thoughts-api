import express from 'express'
// import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useCreateIndex: true 
})
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8082
const app = express()

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    // required: [true, "Du måste skriva något!"],
    unique: true,
    // enum: ['Hej', 'Hello', 'Yo']
    // match: /^[^0-9]+$/ // No numbers
    // validate: {
    //   validator: (value) => {
    //     return /^[^0-9]+$/.test(value)
    //   },
    //   message: "Numbers are not allowed"
    // },
    minlength: 2,
    maxlength: 140
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
  res.send('Hello world')
})
app.get('/thoughts', async (req, res) => {
  const allThoughts = await Thought.find()
  res.json(allThoughts)
})

app.post('/thoughts', async (req, res) => {
  try {
    const newThought = await new Thought({
      message: req.body.message
    }).save()
    res.json(newThought)  
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Duplicated value", fields: error.keyValue })
    }
    res.status(400).json(error)
  }
})

app.post('/thoughts/:id/like', async (req, res) => {
  const { id } = req.params
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


  //   let updatedThought = await Thought.find({
  //     _id: id
  //   })
  //   updatedThought = [...updatedThought, updatedThought.hearts += 1]
  //   res.json(updatedThought)

  } catch {
    res.status(404).json({ message: "Not found" })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
