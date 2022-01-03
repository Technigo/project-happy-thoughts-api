import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

//make scheme seperate if need to reuse or combine
const TweetSchema = new mongoose.Schema({
  message: {
    type: String, //always need a type
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true, //dubbelscheck after white spaces in beginning and end
  },
  hearts: {
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

const Tweet = mongoose.model('Tweet', TweetSchema)

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.json('Hello world')
})

app.post('/', async (req, res) => {
  const { message } = req.body

  // name: name is shorened to: name

  try {
    //Success
    const newTweet = await new Tweet({
      message: message,
      //stop here, saved in node but not in mondoDB
    }).save()
    //dont know how long time save takes, hence await
    res.status(201).json({ response: newTweet, success: true })
  } catch (error) {
    //error
    res.status(400).json({ response: error, success: false })
  }
})

app.post('/:id/hearts', async (req, res) => {
  const { id } = req.params

  try {
    //mongo operator
    const updatedHeart = await Tweet.findByIdAndUpdate(
      id,
      {
        $inc: {
          hearts: 1,
        },
      },
      {
        new: true, //
      },
    )
    console.log('req body', req.body)
    res.status(201).json({ response: updatedHeart, success: true })
  } catch (error) {
    res.status(400).json({ response: 'No tweet with that ID', sucess: false })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
