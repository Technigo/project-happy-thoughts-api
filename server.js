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

// Schema takes one argument - an object :) 
// camelCase for Schema
const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, "Oh your silly message is required"],
    unique: true,  // from a technical perspective unique: true is not a validator the same as required: true. https://mongoosejs.com/docs/validation.html#the-unique-option-is-not-a-validator
    //enum: ['Technigo is cool', 'Technigo is great', 'That was the time of my life'] // only these 3 values are going to be accepted in the value of the message field
    //match: /^[^0-9]+$/, //sort out numbers from a string with regex
    trim: true,
 /*    validate: { 
      validator: (text) => { // argument: the value of whatever will be sent as the message
        return /^[^0-9]+$/.test(text)
      }, */
    message: "",
    minlength: [5, 'Oops your message needs to be longer than 5 characters'],
    maxlength: [140, 'Oops, message is too long! Max length is 140 characters']
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now //so it is not executed - don't call it
  },
  author: {
    type: String,
    default: 'Anonymous',
  },
})

// PascalCase for model
// Two arguments ---> 1. name of collection 2. schema
const Thought = mongoose.model('Thought', thoughtSchema)

app.get('/', (req, res) => {
  res.send(listEndpoints(app)),
  res.json({
    message:
      'Hello all thoughts! View all thoughts at URL LINK here', // add Netlify link
  })
})

// GET This endpoint should return a maximum of 20 thoughts, sorted by createdAt to show the most recent thoughts first.
//.skip(100)? if you use pages (pagination) .limit(20) skip in this case would skip the first 100 documents and limit the results to 20.
// using built in Mongoose methods - otherwise we would need to use .Aggregate([])
app.get('/thoughts', async (req, res) => {
  try {
    const allThoughts = await Thought.find()
      .sort({ createdAt: 'descending' }) // or createdAt: 1 äldsta först // -1 senaste först.
      .limit(20)
      .exec()
    res.json({ length: allThoughts.length, data: allThoughts })
  } catch(err) {
    res
      .status(400)
      .json({ errors: err.errors }) // add a message here when I have seen what could go wrong and which error message pops up.
  }
})

// POST request specify: POST, header, body
// Two arguments, request and response
// 2 lines of code version 2 --->   await newThougth.save() // only the saving process is an asynch process! + delete await from const newThought
app.post('/thoughts', async (req, res) => {
  try { // change req.body to only contain req.body.message  ? as in Damien's video. 
    const newThought = await new Thought(req.body).save()
    res.json({ data: newThought })
  } catch(error) {
    if (error.code === 11000) {
    res.status(400).json({ error: 'Duplicated value', fields: error.keyValue }) //coming from the unique error object (error) in Postman
  }
  res.status(400).json(error)
  }
})


// POST thoughts/:thoughtId/like -->  
app.post('thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId, 
      { $inc: {  // inc ? 
          hearts: 1 
        }
      },
      {
        new: true
      },
    ) 
    if (updatedThought) {
      res.json(updatedThought)
    } else {
      res.status(404).json({ message: 'Not found'})
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error })
  }
})

// DELETE
app.delete('thoughts/:id', async (req, res) => {
  const { id } = req.params

  try {                           // specify the model = Thought
    //const deletedThought = await Thought.deleteOne({ _id: id}) // _id will be equal to our path param id
    // deleteOne --> findOneAndDelete ({ _id: id }) --> findByIdAndDelete(id)
    const deletedThought = await Thought.findByIdAndDelete(id) //remove _id ? when code works **** 
    if (deletedThought) {
      res.json(deletedThought)
    } else {
      res.status(404).json({ message: 'Not found' })
    } 
  } catch(error) { 
    res.status(400).json({ message: 'Invalid request', error }) // feature of ES6 key and value are the same (before error: error)
  }
})

// PUT ----> do this --> CHANGE to PUT + change in FRONTEND as well. POST is very generic!
app.put('thoughts/:id', async (req, res) => {
  const {id} = req.params

  try {                                                   // 3 arguments: 1. id 2. object of the field/s we want to update 3. { new : true } 
    const updatedThought = await Thought.findOneAndReplace({ _id: id }, req.body, { new: true }) //specify what do we want to update
    if (updatedThought) {
      res.json(updatedThought)
    } else {
      res.status(404).json({ message: 'Not found'})
    }
  } catch(error) {
    res.status(400).json({ message: 'Invalid request', error })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
