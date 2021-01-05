import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Message = mongoose.model('Message', {
  message: String,
  name: String,
  hearts: Boolean,
  createdAt: {
    type: Date,
    default: () => new Date()
  }
})

// Start MongoDB: RESET_DB=true npm run dev
// To populate database: remove if-statement, push, put if-statement back, push again
//if (process.env.RESET_DB) {
	const seedDatabase = async () => {
    await Message.deleteMany();
		mongoUrl.forEach(item => {
      const newMessage = new Message(item);
      newMessage.save();
    })
  }
  seedDatabase();
//}

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
  const allMessages = await Message.find(req.query);
  if (allMessages) {
    res.json(allMessages)
  } else {
    res.status(404).json({ error: 'Messages not found'})
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
