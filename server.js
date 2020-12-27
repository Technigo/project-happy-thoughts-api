import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

//____________Create model

// INCLUDES: Message, Hearts, CreatedAt

// required fields for message: 
//→ Required
//→ Min length of 5 characters
// → Max length of 140 characters

// required fields for hearts: 
//→ Defaults to 0  ----> default: 0 

// required fields for createdAt:
//→ Defaults to the current time ----> default: Date.now

const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlenght: 140
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

//____________Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())


//____________Defining routes
app.get('/', (req, res) => {
  res.send('Hello world')
})

// 3 endpoints required 

// GET /thoughts
app.get('/thoughts', (req, res) => {
  /****
  - Maximum of 20 results limit(20)
  - Sorted by createdAt sort({ createdAt: 'desc' })
  - exec()
  - find method
  ****/
})


// POST /thoughts
app.post('/thoughts', (req, res) => {
  /****
  - Async / await 
  - req.body 
  - try (success) / catch (error)
  ****/
})

// POST thoughts/:thoughtId/like
app.post('/thoughts/:_id/like', (req, res) => {
  /****
  - use params for _id 
  - findOneAndUpdate https://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate 
  - $inc https://docs.mongodb.com/manual/reference/operator/update/inc/
  - try (success) / catch (error)
  ****/
})


//____________Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
