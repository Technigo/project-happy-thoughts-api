import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

const MemberSchema = new mongoose.Schema({
  name: {
  type: String,
  required: true,
  unique: true, 
  enum: ['Jennie', 'Matilda', 'Karin', 'Maksymilian'],
  },
  description: {
  type: String,
  minlength: 5,
  maxlength: 10,
  trim: true,
  },
  score: { 
  type: Number,
  default: 0
  },
  createdAt: {
  type: Number,
  default: () => Date.now()
  }
})   

const Member = mongoose.model('Member', MemberSchema)

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Get request to get members
app.get('/members', async (req, res) => {
  const members = await Member.find({}).sort({ createdAt: 1 }).limit(2)
  res.status(200).json({ response: members, success: true })
})

// Post request for new members
app.post('/members', async (req, res) => {
  const { name, description } = req.body;

try {
  const newMember = await new Member({ name, description }).save()
  res.status(201).json({ response: newMember, success: true })
} catch (error) {
res.status(400).json({ response: error, success: false })
}
})

// Post request for increasing score
app.post('/members/:id/score', async (req, res) => {
  const { id } = req.params

  try {
  const updatedMember = await Member.findByIdAndUpdate(
    id, 
    {
     $inc: { 
       score: 1, 
      },
    },
    {
      new: true
    }
    )
  res.status(200).json({ response: updatedMember, success: true })
  } catch (error) {
  res.status(400).json({ response: error, success: false })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
