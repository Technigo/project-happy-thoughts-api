import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import allEndpoints from "express-list-endpoints";
import dotenv from 'dotenv';

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const { Schema } = mongoose;

const thoughtSchema = new Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
})

const Thought = mongoose.model('Thought', thoughtSchema);

new Thought({ message: "Ullabella" }).save();

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

// Update documentation

app.get("/", (req, res) => {
  const documentation = {
    "About": "This is the Happy Thoughts API",
    "Routes": [
      {
        "/": "Documentation",
        "/endpoints": "All endpoints",
        "/thoughts": "Get the 20 latest thoughts",
        "/thoughts": "Add new thought",
        "/thoughts/:thoughtId/like": "Like a thought",
      }
    ]
  }

  res.send(documentation);
});

app.get('/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find()
      .sort({ createdAt: 'desc' })
      .limit(20)
      .exec();
    res.status(200).json(thoughts);
  } catch (err) {
    res.status(400).json({
      error: err.errors
    })
  }

})

app.post('/thoughts', async (req, res) => {
  const { message } = req.body;

  try {
    const thoughtToAdd = await new Thought({ message }).save();
    res.status(201).json(thoughtToAdd);
  } catch (err) {
    res.status(400).json({
      message: 'Could not save thought',
      errors: err.errors
    })
  }
})


app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params

  try {
    const likedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1 } }
    );
    res.status(200).json(likedThought)
  } catch (err) {
    res.status(400).json({
      message: 'Bad request. Could not find thought with requested id.',
      errors: err.errors
    })
  }
})

app.get('/endpoints', (req, res) => {
  res.send(allEndpoints(app));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
