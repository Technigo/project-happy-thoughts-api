import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv';

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

const thoughtSchema = new mongoose.Schema({
 message: {
   type: String,
   required: true,
   trim: true,
   minlength: 5,
   maxlength: 140
 },
 hearts: {
   type: Number,
   default: 0,
 },
 createdAt: {
   type: Date,
   default: Date.now
 }
})

const Thought = mongoose.model('Thought', thoughtSchema)

app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})


app.post('/thoughts', async (req, res) => {
  try {
    const newThought = await new Thought(req.body).save()
    res.json(newThought)
  } catch (error) {
    res.status(400).json(error)
  }
})

app.get('/thoughts', async (req, res) => {

  try {
    const allReasentThoughts = await Thought.find().sort({ createdAt: -1 }).limit(20)
    res.json(allReasentThoughts)
  } catch (error) {

  }
})




// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
