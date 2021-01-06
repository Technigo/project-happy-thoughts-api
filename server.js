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
    default: () => 0
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

// Save new message to database
app.post('/messages', async (req, res) => {
  try {
    const message = new Message({ message: req.body.message })
    await message.save()
    res.status(200).json(message)
  } catch (err) {
    res.status(400).json({ message: 'Could not save message to database', errors: err.errors })
  }
});

// Return all messages to client
app.get('/messages', async (req, res) => {
  //const queryParameters = req.query;
  const allMessages = await Message.find(req.query).sort({ createdAt: 'desc' }).limit(20);
  if (allMessages) {
    res.status(200).json(allMessages)
  } else {
    res.status(404).json({ error: 'Messages not found'})
  }
})

// Save likes to database, returns to client
app.post('/messages/:messageId/like', async (req, res) => {
  try {
    const { messageId } = req.params;
    await Message.updateOne({ _id: messageId }, { $inc: { hearts: +1 } });
    res.status(200).json();
  } catch (err) {
    res.status(400).json({ message: 'Cannot save to database', errors: err.errors })
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})