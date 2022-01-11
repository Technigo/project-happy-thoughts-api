import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts'
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

//make scheme seperate if need to reuse or combine
const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String, //always need a type
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true, //dubbelscheck after white spaces in beginning and end
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Number,
    default: () => Date.now(),
  },
})
//data available: Mixed, Buffer, Date, ObjectID, Array, Decimal128, Map, Schema
// uniqe: true, //check if that name is reserved, throw an error
// enum: ['Jennie', 'Matilda', 'Karin', 'Maks'], //specify only allowed value, ex tags to choose from

const Thought = mongoose.model('Thought', ThoughtSchema)

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', async (req, res) => {
  const { page, perPage, pageNum = +page, perPageNum = +perPage } = req.query //querys are always strings!

  try {
    const thoughts = await Thought.find({})
      .sort({ createdAt: 'desc' })
      .skip(pageNum - 1 * perPageNum) //page-1 makes it not skip first page
      .limit(perPageNum)
    res.status(200).json(thoughts)
  } catch (error) {
    res.status(400).json({ response: error, success: false })
  }
})

app.post('/', async (req, res) => {
  const { message } = req.body

  // name: name is shorened to: name

  try {
    //Success
    const newThought = await new Thought({
      message: message,
      //stop here, saved in node but not in mondoDB
    }).save()
    //dont know how long time save takes, hence await
    res.status(201).json({ response: newThought, success: true })
  } catch (error) {
    //error
    res.status(400).json({ response: error, success: false })
  }
})

app.post('/:id/hearts', async (req, res) => {
  const { id } = req.params

  try {
    //mongo operator
    const updatedHeart = await Thought.findByIdAndUpdate(
      id,
      {
        $inc: {
          hearts: 1,
        },
      },
      {
        new: true, //updated document directly- find in documentary
      },
    )
    console.log('req body', req.body)
    res.status(201).json({ response: updatedHeart, success: true })
  } catch (error) {
    res.status(400).json({ response: 'No thought with that ID', sucess: false })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
