import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts" // name of the database

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  // eslint-disable-next-line no-console
  console.log(`database connected`)
}, (onreject) => {
  // eslint-disable-next-line no-console
  console.log(onreject);
})
mongoose.Promise = Promise

const port = process.env.PORT || 5000
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

const Thougth = mongoose.model("Thougth", {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  heart: {
    type: Number,
    default: 0,
    max: [1, 'Must be just 1 per time, got {VALUE}']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})
// Start defining your routes here
app.get('/thoughts', async (req, res) => {
  try {
    const thought = await Thougth.find().sort({ createdAt: 'desc' }).limit(20)
    res.status(200).json(thought);
  } catch (e) {
    res.status(400).json({ message: "could not get thought", errors: e.errors })
  }
});

app.post('/thoughts', async (req, res) => {
  try {
    const thought = await new Thougth(req.body).save();
    res.status(200).json(thought);
  } catch (e) {
    res.status(400).json({ message: "could not save thought", errors: e.errors })
  }
});

app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const thought = await Thougth.findById(thoughtId)
    if (thought === null || !thought) {
      res.status(404).json({ message: 'Thought does not exist', success: "false" });
    } else {
      const heartUpdated = thought.heart + 1;
      const thoughtUpdated = await Thougth.updateOne({ _id: thoughtId },
        { $set: {
          heart: heartUpdated
        } })
      if (thoughtUpdated.nModified > 0) {
        res.status(200).json({ message: thought.message, heart: heartUpdated, success: "true" });
      } else {
        res.status(404).json({ message: 'nop updated', success: "false" });
      }
    }
  } catch (e) {
    res.status(400).json({ message: "could not save like", errors: e.errors })
  }
});

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
