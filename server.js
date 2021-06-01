import express from 'express'
import dotenv from "dotenv";
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.Promise = Promise

const port = process.env.PORT || 9000
const app = express()

//CREATES SCHEMA
const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, "Ding, dong! Message is required!"],
    validate: {
      validator: (value) => {
        return /^[^0-9]+$/.test(value);
      },
      message: "Numbers are not allowed",
    },
    minlength: [5, 'Hey, the minimum length is 5 characters'],
    maxlength: [140, 'Hey, the maximum length is 140 characters'],
    unique: false,
    trim: true
    },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now //also () => Date.now()
  }
})
//CREATES SINGLE THOUGHT MODEL
const Thought = mongoose.model('Thought', thoughtSchema)

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

// DEFINING ROUTES AND ENDPOINTS
app.get('/', (req, res) => {
  res.send("Hola Mundo! This is Estefania's Happy Coding Thoughts API <3")//replaced by listEndpoints
})

//GET /thoughts: ENDOPINT TO SHOW 20 RECENT POSTS
app.get("/thoughts", async (req, res) => {
  const allThoughts = await Thought.find()
    .sort({ createdAt: -1 })
    .limit(20)
    .exec();
  res.json(allThoughts);
});


//ENDPOINT TO POST A THOUGHT
app.post("/thoughts", async (req, res) => {
  try {
    const newThought = await new Thought(req.body).save();
    res.json(newThought);
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(400)
        .json({ error: "Duplicated value", fields: error.keyValue });
    }
    res.status(400).json(error);
  }
});


//ENDPOINT TO DELETE A THOUGHT
app.delete('/thoughts/:thoughtId', async (req, res) => {
  const { thoughtId } = req.params

  try {
    const deletedThought = await Thought.findByIdAndDelete(id)
    if (deletedThought) {
      res.json(deletedThought)
    } else {
      res.status(404).json({ message: 'Not found' })
    }

  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error })
  }
})

//ENDPOINT TO ADD LIKES/HEARTS


app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const updatedThought = await Thought.findOneAndUpdate(
      {
        _id: thoughtId,
      },
      {
        $inc: {
          hearts: 1,
        },
      },
      {
        new: true,
      }
    );
    if (updatedThought) {
      res.json(updatedThought);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid request", error });
  }
});


// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
