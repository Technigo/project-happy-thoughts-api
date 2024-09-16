import cors from "cors";
import express from "express";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
})

const Message = mongoose.model('Message', messageSchema)

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.get('/thoughts', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 'desc' }).limit(20).exec()
    res.json(messages)
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving messages', error })
  }
})

app.post('/thoughts', async (req, res) => {
  try {
    const { content } = req.body
    if (!content) {
      res.status(400).json({ message: 'Content is required' })
      return
    }
    const newMessage = new Message({ content })
    await newMessage.save()
    res.status(201).json(newMessage)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params
  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1 } },
      { new: true }
    )
    if(!updatedMessage) {
      res.status(404).json({ message: 'Thought not found' })
    } else {
      res.json(updatedMessage)
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid thought ID', error })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
