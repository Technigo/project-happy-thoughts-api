import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Message = mongoose.model('Message', {
  message: {
    type: String,
    minLength: 5,
    maxLength: 140,
    required: true
  },
  
  hearts: {
    type: Number,
    type: Boolean,
    default: 0
  },

  createdAt: {
    type: Date,
    default: () => new Date()
  }
})

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

app.post('/messages', async (req, res) => {
  //console.log(req.body)
  const message = new Message({ message: req.body.message, name: req.body.name, hearts: req.body.hearts })
  await message.save()
  res.json(message)
})

app.get('/messages', async (req, res) => {
  //const queryParameters = req.query;
  const allMessages = await Message.find(req.query).sort(['createdAt', 1]).limit(10);
  if (allMessages) {
    res.status(200).json(allMessages)
  } else {
    res.status(404).json({ error: 'Messages not found'})
  }
})

//app.post('/messages/:_id/like', async (req, res) => {

//}

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})