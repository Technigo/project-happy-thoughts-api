import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
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
    default: 0,
  },
  createdAt: {
    type: Number,
    default: () => Date.now()
  },
})

const Member = mongoose.model('Member', MemberSchema)

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/members', async (req, res) => {

  const {
    page,
    perPage,
    pageNum = Number(page),
    perPageNum = Number(perPage)
  } = req.query

  try {
    const members = await Member.find({})
      .sort({ description: 'asc' })
      .skip((pageNum - 1 * perPageNum))
      .limit(perPageNum)
    // const members = await Member.aggregate([
    //   { 
    //     $sort: {
    //       description: 1
    //     }
    //   },
    //   {
    //     $skip: (pageNum - 1) * perPageNum
    //   },
    //   {
    //     $limit: perPageNum
    //   }
    // ])
    res.status(200).json({ response: members, success: true })
  } catch (error) {
    res.status(400).json({ response: error, success: false })
  }

})

app.post('/members', async (req, res) => {

  const { name, description } = req.body

  try {
    const newMember = await new Member({ name, description }).save()
    res.status(201).json({ response: newMember, success: true })
  } catch (error) {
    res.status(400).json({ response: error, success: false })
  }

})

app.post('/members/:id/score', async (req, res) => {
  
  const { id } = req.params

  try {
    const updatedMember = await Member.findByIdAndUpdate(id, { 
      $inc: { 
        score: 1
      },
    },
    {
      new: true
    })
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
