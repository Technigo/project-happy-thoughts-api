import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const messageSchema = new mongoose.Schema({
  content: String,
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

app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 'desc' }).limit(20).exec()
    res.json(messages)
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving messages', error })
  }
})

app.post('/messages', async (req, res) => {
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

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
