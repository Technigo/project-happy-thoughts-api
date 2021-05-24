import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


const port = process.env.PORT || 8080
const app = express()

const thoughtSchema = new mongoose.Schema({
  message: String,
  hearts: Number,
  createdAt: Date
});

const Thought = mongoose.model('Thought', thoughtSchema);

app.use(cors())
app.use(express.json())

// Routes
app.get('/', (req, res) => {
  res.send('Hello world')
});

app.post('/thoughts', async (req, res) => {
  const savedThought = await new Thought({
    message: req.body.message,
    hearts: 0,
    createdAt: Date.now()
  }).save();
  res.json(savedThought);
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
